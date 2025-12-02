# GSAP Libraries - Download Instructions

## Files to Download

Download these files from the GSAP CDN and place them in this `js/libs/` folder:

### 1. GSAP Core Library
**URL**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js`
**Save as**: `gsap.min.js`

### 2. ScrollTrigger Plugin
**URL**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js`
**Save as**: `ScrollTrigger.min.js`

### 3. ScrollToPlugin
**URL**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollToPlugin.min.js`
**Save as**: `ScrollToPlugin.min.js`

## Quick Download Commands

### Using PowerShell (Windows):
```powershell
# Download GSAP core
Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js" -OutFile "js/libs/gsap.min.js"

# Download ScrollTrigger
Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js" -OutFile "js/libs/ScrollTrigger.min.js"

# Download ScrollToPlugin
Invoke-WebRequest -Uri "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollToPlugin.min.js" -OutFile "js/libs/ScrollToPlugin.min.js"
```

### Using curl (Mac/Linux):
```bash
curl -o js/libs/gsap.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js
curl -o js/libs/ScrollTrigger.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js
curl -o js/libs/ScrollToPlugin.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollToPlugin.min.js
```

### Using wget (Linux):
```bash
wget -O js/libs/gsap.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js
wget -O js/libs/ScrollTrigger.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js
wget -O js/libs/ScrollToPlugin.min.js https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollToPlugin.min.js
```

## Manual Download

1. Open each URL in your browser
2. Right-click → "Save As"
3. Save to `js/libs/` folder with the exact filenames listed above

## File Structure After Download

```
js/
├── libs/
│   ├── gsap.min.js
│   ├── ScrollTrigger.min.js
│   └── ScrollToPlugin.min.js
├── main.js
└── modules/
    ├── breathing.js
    ├── parallax.js
    ├── particles.js
    └── quiz.js
```

## Verification

After downloading, verify the files exist:
- `js/libs/gsap.min.js` (should be ~150KB)
- `js/libs/ScrollTrigger.min.js` (should be ~50KB)
- `js/libs/ScrollToPlugin.min.js` (should be ~10KB)

## License

All GSAP plugins are free for commercial use. See: https://greensock.com/standard-license/

