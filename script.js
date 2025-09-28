let map;
let streetView;
let currentPosition;
let currentHeading = 0;

// Step sizes
const headingStepDegrees = 10; // left/right
const moveStepMeters = 5; // forward/reverse

function initMap() {
    currentPosition = { lat: 25.7617, lng: -80.1918 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPosition,
        zoom: 16,
        mapTypeId: 'roadmap'
    });

    streetView = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'), {
            position: currentPosition,
            pov: { heading: currentHeading, pitch: 0 },
            zoom: 1,
            addressControl: false,
            linksControl: false,
            panControl: false,
            enableCloseButton: false
        }
    );

    map.setStreetView(streetView);

    setupAutocomplete();
    setupEventListeners();
    updateDisplay();
}

function setupAutocomplete() {
    const input = document.getElementById('address-input');

    // Build a simple suggestions container
    let suggestions = document.getElementById('address-suggestions');
    if (!suggestions) {
        suggestions = document.createElement('div');
        suggestions.id = 'address-suggestions';
        suggestions.style.position = 'absolute';
        suggestions.style.background = '#fff';
        suggestions.style.border = '1px solid #ccc';
        suggestions.style.zIndex = '1000';
        suggestions.style.maxHeight = '220px';
        suggestions.style.overflowY = 'auto';
        suggestions.style.display = 'none';
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(suggestions);
    }

    const syncWidth = () => {
        const rect = input.getBoundingClientRect();
        suggestions.style.width = rect.width + 'px';
        suggestions.style.left = '0px';
        suggestions.style.top = (input.offsetHeight + 6) + 'px';
    };
    syncWidth();
    window.addEventListener('resize', syncWidth);

    let sessionToken = new google.maps.places.AutocompleteSessionToken();
    const autocompleteService = new google.maps.places.AutocompleteService();
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));

    function clearSuggestions() {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
    }

    function renderPredictions(predictions) {
        suggestions.innerHTML = '';
        predictions.forEach((p) => {
            const item = document.createElement('div');
            item.textContent = p.description;
            item.style.padding = '8px 10px';
            item.style.cursor = 'pointer';
            item.style.lineHeight = '1.3';
            item.addEventListener('mousedown', () => selectPrediction(p));
            item.addEventListener('touchstart', () => selectPrediction(p));
            suggestions.appendChild(item);
        });
        suggestions.style.display = predictions.length ? 'block' : 'none';
        syncWidth();
    }

    function selectPrediction(prediction) {
        clearSuggestions();
        input.value = prediction.description;
        placesService.getDetails({ placeId: prediction.place_id, fields: ['geometry', 'formatted_address'] }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
                const location = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                moveToLocation(location);
                sessionToken = new google.maps.places.AutocompleteSessionToken();
            } else {
                geocodeAddress(prediction.description);
            }
        });
    }

    input.addEventListener('input', () => {
        const query = input.value.trim();
        if (!query) {
            clearSuggestions();
            return;
        }
        autocompleteService.getPlacePredictions({ input: query, sessionToken }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                renderPredictions(predictions);
            } else {
                clearSuggestions();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target !== input && !suggestions.contains(e.target)) {
            clearSuggestions();
        }
    });
}

function setupEventListeners() {
    document.getElementById('address-input').addEventListener('keypress', handleAddressInput);

    document.getElementById('left-btn').addEventListener('click', () => rotateLeft());
    document.getElementById('right-btn').addEventListener('click', () => rotateRight());
    document.getElementById('forward-btn').addEventListener('click', () => moveForward());
    document.getElementById('reverse-btn').addEventListener('click', () => moveReverse());

    document.getElementById('map-view-btn').addEventListener('click', () => {
        map.setMapTypeId('roadmap');
        document.getElementById('map-view-btn').classList.add('active');
        document.getElementById('satellite-view-btn').classList.remove('active');
    });

    document.getElementById('satellite-view-btn').addEventListener('click', () => {
        map.setMapTypeId('satellite');
        document.getElementById('satellite-view-btn').classList.add('active');
        document.getElementById('map-view-btn').classList.remove('active');
    });

    // Keyboard: A/D rotate, W forward, S reverse
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const key = e.key.toLowerCase();
        if (key === 'a' || key === 'arrowleft') { rotateLeft(); e.preventDefault(); }
        if (key === 'd' || key === 'arrowright') { rotateRight(); e.preventDefault(); }
        if (key === 'w' || key === 'arrowup') { moveForward(); e.preventDefault(); }
        if (key === 's' || key === 'arrowdown') { moveReverse(); e.preventDefault(); }
    });
}

function rotateLeft() {
    currentHeading = (currentHeading - headingStepDegrees + 360) % 360;
    streetView.setPov({ heading: currentHeading, pitch: 0 });
    updateDisplay();
}

function rotateRight() {
    currentHeading = (currentHeading + headingStepDegrees) % 360;
    streetView.setPov({ heading: currentHeading, pitch: 0 });
    updateDisplay();
}

function moveForward() {
    moveByStep(moveStepMeters);
}

function moveReverse() {
    moveByStep(-moveStepMeters);
}

function moveByStep(meters) {
    // Use geometry library to compute offset
    const origin = new google.maps.LatLng(currentPosition.lat, currentPosition.lng);
    const destination = google.maps.geometry.spherical.computeOffset(origin, Math.abs(meters), currentHeading + (meters < 0 ? 180 : 0));
    currentPosition = { lat: destination.lat(), lng: destination.lng() };

    streetView.setPosition(currentPosition);
    map.setCenter(currentPosition);
    updateLocationText();
}

function handleAddressInput(event) {
    if (event.key === 'Enter') {
        const address = event.target.value;
        if (address) {
            geocodeAddress(address);
        }
    }
}

function geocodeAddress(address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            moveToLocation({ lat: location.lat(), lng: location.lng() });
        } else {
            alert('Could not find that address. Please try a different location.');
        }
    });
}

function moveToLocation(newLocation) {
    currentPosition = newLocation;
    map.setCenter(currentPosition);
    streetView.setPosition(currentPosition);
    updateLocationText();
}

function updateLocationText() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: currentPosition }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const addressParts = address.split(', ');
            let displayText = '';
            if (addressParts.length >= 3) {
                displayText = addressParts[0] + '<br>' + addressParts.slice(-2).join(', ');
            } else {
                displayText = address;
            }
            document.getElementById('location-text').innerHTML = displayText;
        }
    });
}

function updateDisplay() {
    document.getElementById('direction-display').textContent = Math.round(currentHeading) + '°';
}

window.initMap = initMap;