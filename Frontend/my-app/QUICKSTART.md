# FinTrack Frontend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Prerequisites
- Node.js 18+ installed
- A terminal/command prompt
- Your FastAPI backend running

### 2. Start Development Server

```bash
cd DEVSOC/Frontend/my-app
npm run dev
```

Your app will open at **http://localhost:5173** (or the next available port).

### 3. Default Test Credentials
- **Email**: test@example.com
- **Password**: password123

## 📋 Project Files Overview

```
my-app/
├── src/
│   ├── pages/                    # Full page components
│   │   ├── Landing.jsx          # Homepage with animated background
│   │   ├── Login.jsx            # Authentication page
│   │   └── Dashboard.jsx        # Main analysis interface
│   ├── components/              # Reusable components
│   │   ├── Navbar.jsx           # Header navigation
│   │   ├── SpeciesSelector.jsx
│   │   ├── LocationInput.jsx
│   │   ├── RiverSelector.jsx
│   │   └── ResultDisplay.jsx    # Shows ML results
│   ├── App.jsx                  # Main router
│   └── main.jsx                 # Entry point
├── package.json                 # Dependencies
├── .env.example                 # Example env file
├── FRONTEND_README.md           # Full documentation
└── BACKEND_INTEGRATION.md       # Connect to your API
```

## 🎨 Key Features Implemented

✅ **Landing Page**
- Vanta.js animated fog background with Three.js
- Smooth pop-in animation on title
- Responsive glass UI buttons
- Floating shape animations

✅ **Login Page**
- Glass-morphic card design
- Email validation
- Password verification
- Redirect to dashboard on success

✅ **Dashboard Page**
- Two-column layout (form + results)
- Species selection dropdown
- Location text input
- River selection dropdown
- Real-time analysis results
- Risk level badges (Low/Medium/High)
- Support for chart/image display

✅ **Modern UI**
- Glassmorphism design throughout
- Smooth animations and transitions
- Responsive mobile-first design
- Professional gradient scheme

## 🔗 Connecting to FastAPI Backend

### Setup Environment Variables

1. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your backend URL**:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

3. **Your FastAPI backend must have**:
   ```
   POST /api/analyze
   ```

   Accepts:
   ```json
   {
     "species": "Fish",
     "location": "Kanpur",
     "river": "Ganga"
   }
   ```

   Returns:
   ```json
   {
     "prediction": "Your analysis text",
     "risk_level": "Low|Medium|High",
     "details": "Additional info",
     "chart_url": null or "image_url"
   }
   ```

### FastAPI CORS Configuration

Add this to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🧪 Testing

### Test Login Flow
1. Click "Get Started" on landing page
2. Enter any email and password (>= 6 chars)
3. Should redirect to Dashboard

### Test Analysis (No Backend)
1. Fill in species, location, and river
2. Click "Analyze"
3. You'll see demo response (if backend not running)

### Test with Real Backend
1. Start your FastAPI server
2. Submit real data from dashboard
3. View results with ML predictions

## 📁 Important Files to Modify

### Update Backend URL
- **File**: `.env`
- **Change**: `VITE_BACKEND_URL=http://your-backend:8000`

### Add More River Options
- **File**: `src/components/RiverSelector.jsx`
- **Change**: Add to `RIVER_OPTIONS` array

### Add More Species Options
- **File**: `src/components/SpeciesSelector.jsx`
- **Change**: Add to `SPECIES_OPTIONS` array

### Customize Colors
- **File**: `src/pages/Landing.css`, `Dashboard.css`, etc.
- **Change**: Gradient values in color schemes

## 🛠️ Available NPM Commands

```bash
npm run dev      # Start development server (HMR enabled)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint checks
```

## 📱 Responsive Design

- **Desktop**: Full two-column layout
- **Tablet**: Single column, responsive grid
- **Mobile**: Optimized for small screens, touch-friendly

## 🔒 Authentication

Current implementation:
- Simple localStorage-based auth
- No real backend authentication
- For production, integrate proper JWT/auth system

To add real auth:
1. Update Login.jsx to call authentication API
2. Store auth token in localStorage
3. Add token to all API requests
4. Add route guards using React Router

## 🎯 Next Steps

1. **Integrate Backend**: Update `.env` and test API connection
2. **Add Real Authentication**: Replace demo auth with real login
3. **Customize Styling**: Adjust colors/fonts in CSS files
4. **Add More Features**: Charts, history, export, etc.
5. **Deploy**: Build and host on Vercel, Netlify, or your server

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Backend Connection Error
1. Check backend is running on correct port
2. Verify `.env` has correct URL
3. Check browser console for CORS errors
4. Ensure FastAPI has CORS middleware

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check CSS file syntax

## 📚 Learn More

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Vanta.js**: https://www.vantajs.com
- **React Router**: https://reactrouter.com

## 💡 Pro Tips

1. Use DevTools (F12) to inspect network requests
2. Check Console tab for JavaScript errors
3. Use Network tab to debug API calls
4. The app has hot module replacement (HMR) - code changes appear instantly
5. localStorage stores user session - clear it if needed

---

**Happy coding! 🚀** If you encounter issues, check FRONTEND_README.md or BACKEND_INTEGRATION.md for detailed guides.
