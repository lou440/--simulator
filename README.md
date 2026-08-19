# Notice

The live demo is currently taken down to the cost of Google Maps API.
Feel free to clone this project and use your own Google Maps API key
---

# Street View Driving Simulation

A web-based driving simulation using Google Street View that lets you explore cities and addresses around the world with keyboard controls.

## Features

- **Street View Integration**: Real Google Street View panoramas for authentic driving experience
- **Multiple Control Methods**: 
  - WASD keys (W=Accelerate, S=Brake, A=Left, D=Right)
  - Arrow keys (Up=Accelerate, Down=Brake, Left=Left, Right=Right)
  - On-screen buttons for touch devices
- **Address Search**: Enter any address to drive there with modern Places predictions
- **Real-time Display**: Speed and direction indicators
- **Map Integration**: Side-by-side map view with satellite/roadmap toggle
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

1. **Get a Google Maps API Key**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Street View Static API
     - Geocoding API
     - Places API
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Configure the API Key**:
   - Open `index.html`
   - Replace `YOUR_API_KEY` with your actual Google Maps API key:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&v=weekly&callback=initMap"></script>
   ```
   - Note: We intentionally omit `libraries=places` because the modern Places library is served automatically with the core loader when needed. `v=weekly` ensures you get the latest non-breaking updates.

3. **Run the Application**:
   - Simply open `index.html` in a web browser
   - Or serve it using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## Usage

### Keyboard Controls
- **W** or **↑**: Accelerate
- **S** or **↓**: Brake
- **A** or **←**: Turn left
- **D** or **→**: Turn right

### Mouse/Touch Controls
- Use the on-screen buttons for accelerate, brake, left, and right
- Enter addresses in the search field and press Enter
- Toggle between Map and Satellite views

### Navigation
1. Type an address and pick a suggestion, or press Enter to geocode
2. Use keyboard keys or on-screen buttons to control movement
3. Watch the speed and direction indicators in the top-right
4. The map on the right shows your current location and surroundings

## File Structure

```
street-view-driving-simulation/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Notes

- The simulation uses Google Street View data, so driving is limited to areas with Street View coverage
- Movement speed and physics are simplified for a smooth experience
- The application requires an active internet connection to load Street View data
- Some areas may have limited or no Street View coverage

## Troubleshooting

- If you see a "This page can't load Google Maps correctly" modal, your API key is missing, restricted, or billing is not enabled. Verify:
  - Billing is enabled on the project
  - The key is unrestricted for `http://localhost` during development or properly restricted to your domain
  - The following APIs are enabled: Maps JavaScript, Street View Static, Geocoding, Places
- If Autocomplete suggestions do not appear, check the browser console for Places API errors and confirm Places API is enabled.

## Inspiration

Based on the original Street View Driver concept from MapChannels, enhanced with keyboard controls and modern web technologies.
