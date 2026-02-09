# FinTrack - Visual Overview

## 🎨 Application Screenshots (Text-Based)

### Landing Page
```
┌─────────────────────────────────────────────────────┐
│  FinTrack  [Login] [Sign Up]                        │  ← Navbar
├─────────────────────────────────────────────────────┤
│                                                     │
│     🌊 Animated Vanta.js Background (Fog)         │
│        ↓                                            │
│                                                     │
│            ╔══════════════════════╗               │
│            ║     FINTRACK         ║               │
│            ║                      ║               │
│            ║  Environmental       ║               │
│            ║  Analysis System     ║               │
│            ║                      ║               │
│            │  [Get Started]       │               │
│            │  [Learn More]        │               │
│            ╚══════════════════════╝               │
│                                                     │
│     〰 Floating Shapes Animation                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Login Page
```
┌─────────────────────────────────────────────────────┐
│  FinTrack  [Login] [Sign Up]                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│            ╔═══════════════════════╗              │
│            ║   Welcome Back        ║              │
│            ║ Sign in to account    ║              │
│            ║                       ║              │
│            │ 📧 Email              │              │
│            │ [___________________] │              │
│            │                       │              │
│            │ 🔑 Password           │              │
│            │ [___________________] │              │
│            │                       │              │
│            │  [Sign In Button] •   │              │
│            │                       │              │
│            │ Don't have account?   │              │
│            ╚═══════════════════════╝              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Dashboard Page
```
┌──────────────────────────────────────────────────────┐
│ FinTrack  [Login] [Sign Up]          [Logout Button] │
├──────────────────────────────────────────────────────┤
│ ML Environmental Analysis                            │
├────────────────────┬─────────────────────────────────┤
│                    │                                 │
│  Enter Details     │  Analysis Results               │
│  ═══════════════   │  ═════════════════              │
│                    │                                 │
│  Species ▼         │  ┌───────────────────────┐     │
│  [Fish______]      │  │ Prediction Text       │     │
│                    │  │                       │     │
│  Location          │  │ Risk: [MEDIUM] ⚠️     │     │
│  [Kanpur___]       │  │                       │     │
│                    │  │ Details:              │     │
│  River ▼           │  │ [Details here]        │     │
│  [Ganga____]       │  │                       │     │
│                    │  │ [Chart Image if       │     │
│  [Analyze]         │  │  available]           │     │
│                    │  └───────────────────────┘     │
│                    │                                 │
│                    │  Status: Submit to analyze     │
│                    │                                 │
└────────────────────┴─────────────────────────────────┘
```

## 🎯 User Journey Flow

```
START
  │
  ├─ User visits http://localhost:5174
  │
  └─► LANDING PAGE
      │  (Vanta.js animated background)
      │  (Title with pop-in animation)
      │  [Get Started] button
      │
      └─► Click "Get Started"
          │
          └─► LOGIN PAGE
              │  (Glass card design)
              │  Email input
              │  Password input
              │  Validation
              │
              └─► Click "Sign In"
                  │  ✓ Valid → localStorage.setItem('user')
                  │  ✗ Invalid → Show error
                  │
                  └─► DASHBOARD PAGE
                      │  (Two-column layout)
                      │  Left: Analysis Form
                      │  Right: Results
                      │
                      ├─► Fill Form
                      │   ├─ Select Species
                      │   ├─ Enter Location
                      │   └─ Select River
                      │
                      ├─► Click "Analyze"
                      │   ├─ Validate inputs
                      │   ├─ POST to /api/analyze
                      │   ├─ Show loading spinner
                      │   └─ Receive results
                      │
                      ├─► Display Results
                      │   ├─ Prediction text
                      │   ├─ Risk level badge
                      │   ├─ Details
                      │   └─ Chart image
                      │
                      └─► Click "Logout"
                          ├─ localStorage.removeItem('user')
                          │
                          └─► Back to LANDING PAGE

END
```

## 🏗️ Component Tree

```
App
├── <Router>
    ├── Route "/" → Landing
    │   └── Navbar
    │       ├── Logo
    │       ├── [Login Button]
    │       └── [Sign Up Button]
    │
    ├── Route "/login" → Login
    │   ├── Navbar
    │   └── LoginCard
    │       ├── <form>
    │       │   ├── EmailInput
    │       │   ├── PasswordInput
    │       │   └── [SignInButton]
    │       └── ErrorMessage (conditional)
    │
    └── Route "/dashboard" → Dashboard
        ├── Navbar
        ├── DashboardHeader
        │   ├── Title "ML Environmental Analysis"
        │   └── [LogoutButton]
        │
        └── DashboardContainer (2-column grid)
            ├── AnalysisCard (Left Column)
            │   └── <form>
            │       ├── SpeciesSelector
            │       │   └── <select>
            │       ├── LocationInput
            │       │   └── <input type="text">
            │       ├── RiverSelector
            │       │   └── <select>
            │       └── [AnalyzeButton]
            │
            └── ResultsCard (Right Column)
                └── ResultDisplay
                    ├── EmptyState
                    ├── LoadingState
                    │   └── Spinner
                    ├── ErrorState
                    │   └── ErrorMessage
                    └── SuccessState
                        ├── PredictionSection
                        ├── RiskLevelSection
                        │   └── RiskBadge
                        ├── DetailsSection
                        └── ChartSection
                            └── <img>
```

## 📊 Data Flow Diagram

```
User Input
    ↓
React State
    ├─ species: string
    ├─ location: string
    ├─ river: string
    ├─ result: object
    ├─ loading: boolean
    └─ error: string
    ↓
Form Submission
    ├─ Validate
    ├─ Set loading=true
    └─ POST Request
        ↓
API Endpoint: POST /api/analyze
        ├─ Receive: {species, location, river}
        ├─ Process: ML Model
        └─ Return: {prediction, risk_level, details, chart_url}
        ↓
Response Handling
    ├─ Success: setResult(data)
    ├─ Error: setError(message)
    └─ Set loading=false
    ↓
UI Re-render
    ↓
Display Results
    ├─ Prediction text
    ├─ Risk level badge
    ├─ Details
    └─ Chart image
```

## 🎨 Design System

### Colors
```
Primary Gradient: #667eea → #764ba2
├─ Used for: Buttons, accents, backgrounds
└─ Soft purple to violet

Secondary Colors:
├─ Success (Low Risk): #22c55e (Green)
├─ Warning (Medium): #fb923c (Orange)
├─ Danger (High): #ef4444 (Red)
└─ Background: rgba(255, 255, 255, 0.1)

Text Colors:
├─ Primary: white (rgba(255, 255, 255, 0.9))
├─ Secondary: rgba(255, 255, 255, 0.7)
└─ Muted: rgba(255, 255, 255, 0.5)

Glassmorphism:
├─ Backdrop blur: 10-20px
├─ Background: rgba(255, 255, 255, 0.1-0.25)
└─ Border: 1px rgba(255, 255, 255, 0.2)
```

### Typography
```
Font Family: System font stack
├─ -apple-system
├─ BlinkMacSystemFont
├─ 'Segoe UI'
└─ Fallback: sans-serif

Sizes (Responsive with clamp):
├─ Hero Title: 2.5rem - 5rem
├─ Page Heading: 1.5rem - 2rem
├─ Section Heading: 1rem - 1.2rem
├─ Body Text: 0.9rem - 1rem
└─ Small Text: 0.85rem - 0.95rem
```

### Spacing
```
Standard Spacing Scale:
├─ 0.5rem (8px) - Small elements
├─ 1rem (16px) - Standard padding
├─ 1.5rem (24px) - Section spacing
├─ 2rem (32px) - Large sections
└─ 3rem (48px) - Page gaps

Padding:
├─ Cards: 2rem
├─ Form groups: 1.5rem
├─ Buttons: 0.875rem (vertical), 1.5rem (horizontal)
└─ Inputs: 0.75rem

Gaps:
├─ Form elements: 1.5rem
├─ Nav buttons: 1rem
├─ Dashboard columns: 2rem
└─ Mobile adjustments: 0.5rem-1rem
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├─ Single column layout
├─ Smaller fonts with clamp()
├─ Reduced padding and gaps
├─ Stacked elements
└─ Touch-friendly sizing

Tablet (768px - 968px)
├─ Transition layout
├─ Medium-sized fonts
├─ Adjusted spacing
└─ Grid adjustments

Desktop (> 968px)
├─ Two-column dashboard
├─ Full spacing
├─ Hover effects enabled
└─ Maximum optimization
```

## ⚡ Performance Metrics

```
Build Output:
├─ HTML: 0.45 KB (0.29 KB gzipped)
├─ CSS: 12.38 KB (2.99 KB gzipped)
├─ Vanta.js: 12.86 KB (4.49 KB gzipped)
├─ Main JS: 276.53 KB (91.19 KB gzipped)
├─ Three.js: 667.35 KB (172.18 KB gzipped)
└─ Total: ~969 KB (272 KB gzipped)

Page Load Timeline:
├─ HTML download: ~50ms
├─ CSS parse: ~100ms
├─ JS execution: ~200-400ms
├─ React hydration: ~100-200ms
├─ Vanta init: ~200-300ms
└─ Ready for interaction: ~600-1000ms

Lighthouse Scores (Potential):
├─ Performance: 85-95%
├─ Accessibility: 90-95%
├─ Best Practices: 90-95%
└─ SEO: 90-95%
```

## 🔐 Authentication Flow

```
User visits app
    ↓
Check localStorage for 'user'
    ├─ ✓ Found → Load Dashboard
    └─ ✗ Not found → Load Landing/Login
    
Login Flow:
    ├─ User enters credentials
    ├─ Validate format
    ├─ Store in localStorage
    ├─ Show success
    └─ Redirect to Dashboard
    
Logout Flow:
    ├─ User clicks logout
    ├─ Remove from localStorage
    ├─ Clear form inputs
    └─ Redirect to Landing
    
Session Persistence:
    ├─ Browser closes → Data remains
    ├─ Refresh page → User still logged in
    ├─ New tab → Can check localStorage
    └─ Clear cache → User logged out
```

## 🎬 Animation Timeline

```
Landing Page Load:
├─ 0ms: Page visible
├─ 100ms: Vanta background initializing
├─ 300ms: Hero title fade-in-up
├─ 500ms: Title scale animation (popIn)
├─ 600ms: Buttons fade in
├─ 800ms: Floating shapes begin animation
└─ Complete: ~1 second, interactive immediately

Button Hover:
├─ 0ms: Mouse enters
├─ 150ms: Transform Y-axis -3px
├─ 150ms: Box shadow increases
└─ 300ms: Back to normal on leave

Form Focus:
├─ 0ms: Input focused
├─ 150ms: Border color brightens
├─ 150ms: Background opacity increases
└─ 300ms: Box shadow appears

Page Transition:
├─ 0ms: Route change
├─ 100ms: Content fade in
├─ 300ms: Content position transition
└─ 500ms: Fully visible
```

## 🧪 Testing Scenarios

```
Happy Path (Everything Works):
  1. Land on page → See animation
  2. Click Get Started → Go to login
  3. Enter credentials → Form validates
  4. Click Sign In → Go to dashboard
  5. Fill form → Inputs change
  6. Click Analyze → API call made
  7. Results show → Display correctly
  8. Click logout → Return to landing
  ✓ All working as expected

Error Scenarios:
  1. Invalid email → Show error
  2. Short password → Show error
  3. Missing field → Prevent submit
  4. API error → Show error message
  5. Network failure → Show demo response
  6. No results → Show empty state

Edge Cases:
  1. Extremely long input → Handle gracefully
  2. Special characters → Accept/validate
  3. Rapid button clicks → Prevent double submit
  4. Slow network → Show loading state
  5. Large chart images → Display within bounds
  6. Browser back button → Maintain state
```

---

**This visual guide complements the technical documentation files.**
**Refer to the other .md files for detailed implementation information.**
