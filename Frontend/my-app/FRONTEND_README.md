# FinTrack - ML-Powered Environmental Analysis System

A modern React + Vite frontend application for analyzing aquatic ecosystems using machine learning.

## Project Overview

FinTrack is a web-based environmental monitoring system that provides an intuitive interface for users to analyze water quality and ecosystem health across Indian rivers. The frontend communicates with a FastAPI backend that runs ML models for environmental analysis.

### Features

- **Landing Page**: Attractive animated homepage with Vanta.js Three.js background
- **Authentication**: Simple login system with localStorage persistence
- **Dashboard**: Main analysis interface with:
  - Species selection dropdown
  - Location input field
  - River selection dropdown
  - Dynamic result display with risk levels
  - Support for chart/heatmap visualization
  
- **Modern UI**: Glassmorphism design with smooth animations and responsive layout
- **Real-time Feedback**: Loading states, error handling, and success feedback

## Tech Stack

- **Framework**: React 19.2 with Hooks
- **Build Tool**: Vite 7.3
- **Routing**: React Router DOM 7
- **API Client**: Axios 1.7
- **Animations**: Vanta.js with Three.js
- **Styling**: CSS3 with Glassmorphism effects

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx        # Landing page with Vanta background
│   ├── Landing.css
│   ├── Login.jsx          # Login authentication page
│   ├── Login.css
│   ├── Dashboard.jsx      # Main analysis interface
│   └── Dashboard.css
├── components/
│   ├── Navbar.jsx         # Navigation header
│   ├── Navbar.css
│   ├── SpeciesSelector.jsx
│   ├── LocationInput.jsx
│   ├── RiverSelector.jsx
│   ├── ResultDisplay.jsx
│   └── FormComponents.css
├── assets/                # Static assets
├── App.jsx               # Main router setup
├── App.css
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Backend server running (FastAPI)

### Steps

1. **Navigate to the project**:
   ```bash
   cd DEVSOC/Frontend/my-app
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Create environment configuration**:
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your backend URL**:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

## Running the Application

### Development Server
```bash
npm run dev
```
This starts the Vite dev server at http://localhost:5173 (or another port if 5173 is busy).

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Usage Guide

### Landing Page
- First page users see
- Features animated background using Vanta.js
- "Get Started" button directs to login
- Fully responsive design

### Login Page
- Simple email + password form
- Input validation
- Success redirects to Dashboard
- Demo mode: any email and password ≥6 characters works

### Dashboard
- **Species Selection**: Choose from Fish, Algae, Microorganisms, or Aquatic Plants
- **Location Input**: Enter any location name
- **River Selection**: Select from major Indian rivers (Ganga, Yamuna, Brahmaputra, etc.)
- **Analyze Button**: Submits request to backend API
- **Results Section**: Displays:
  - Prediction text
  - Risk level (Low/Medium/High)
  - Additional details
  - Charts/images (if backend provides URL)

## API Integration

### Backend API Endpoint

The frontend expects a POST endpoint at your backend:

```
POST /api/analyze
```

**Request Body**:
```json
{
  "species": "Fish",
  "location": "Kanpur",
  "river": "Ganga"
}
```

**Expected Response** (example):
```json
{
  "prediction": "Analysis results here",
  "risk_level": "Medium",
  "details": "Detailed information",
  "chart_url": "https://example.com/chart.png"
}
```

### Configuring Backend URL

Update your backend URL in `.env`:
```
VITE_BACKEND_URL=http://your-backend-url:8000
```

Then in components, use:
```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const response = await fetch(`${BACKEND_URL}/api/analyze`, {...})
```

## Component Details

### Pages

#### Landing.jsx
- Vanta.js fog animation background
- Hero section with title and CTA buttons
- Responsive typography and animation states
- Floating shapes for visual interest

#### Login.jsx
- Glass-morphic login card
- Email and password validation
- Stores user in localStorage (demo auth)
- Redirects to dashboard on success

#### Dashboard.jsx
- Two-column grid layout (form + results)
- Integrates all selector components
- Handles API calls with error/loading states
- Protected route (checks localStorage for user)
- Logout functionality

### Components

#### Navbar.jsx
- Fixed navigation with glassmorphism effect
- Responsive design with mobile menu support
- Links to Login and Sign Up pages
- Branded FinTrack logo

#### SpeciesSelector.jsx
- Dropdown with predefined options
- Options: Fish, Algae, Microorganisms, Aquatic Plants

#### LocationInput.jsx
- Text input for user to enter location
- Placeholder with example locations

#### RiverSelector.jsx
- Dropdown with major Indian rivers
- Options include: Ganga, Yamuna, Brahmaputra, Godavari, Krishna, Narmada, Indus

#### ResultDisplay.jsx
- Conditional rendering based on state
- Shows loading spinner during analysis
- Displays error messages
- Shows success results with risk level badges
- Supports image/chart display

## Styling & Design

### Glassmorphism
- Backdrop blur effects
- Transparent backgrounds with white overlay
- Smooth gradient transitions
- Used throughout for modern aesthetic

### Color Scheme
- Primary Gradient: #667eea → #764ba2 (Purple to Violet)
- White text on dark translucent backgrounds
- Success (Green), Warning (Orange), Error (Red) states

### Animations
- Pop-in effect on hero title
- Fade-in on page loads
- Hover effects on buttons
- Floating shapes background animation
- Smooth transitions on form elements

## Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 968px
  - Desktop: > 968px
- Responsive typography with clamp()
- Grid adjusts to single column on mobile

## Error Handling

- Network errors show user-friendly messages
- Demo fallback when backend unavailable
- Form validation before submission
- Required field checks
- Auto-focus on errors

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of Vanta.js
- CSS animations use GPU acceleration
- Optimized image handling
- Minimal dependencies

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Backend Connection Issues
- Ensure FastAPI server is running
- Check backend URL in .env matches server address
- Check CORS configuration on backend
- Open browser DevTools console for error messages

### Vanta Animation Not Showing
- Check browser console for Three.js errors
- Ensure WebGL is supported
- Try refreshing the page
- Clear browser cache

### Form Not Submitting
- Verify all fields are filled
- Check browser console for API errors
- Ensure backend endpoint exists
- Check network tab for response details

## Future Enhancements

- [ ] User registration system
- [ ] Database for user accounts
- [ ] Historical analysis tracking
- [ ] Multi-language support
- [ ] Advanced charts and analytics
- [ ] Export results to PDF/CSV
- [ ] Real-time data streaming
- [ ] Mobile app version

## Development Notes

- ESLint configured with React best practices
- Hot Module Replacement (HMR) enabled
- Babel React Compiler for optimizations
- All components are functional with hooks

## Contributing

1. Create a feature branch
2. Make changes following existing patterns
3. Test thoroughly on mobile and desktop
4. Submit a pull request

## License

MIT License - Feel free to use this project for educational purposes.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Ensure backend API is properly configured
4. Check network requests in DevTools

---

**Happy Analyzing!** 🌊 🐠
