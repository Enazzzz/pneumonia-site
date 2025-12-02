# Local Fonts

## Inter Font Family

To make the site fully self-contained, download the Inter font files and place them here.

### Download Inter Font

1. **From Google Fonts**:
   - Visit: https://fonts.google.com/specimen/Inter
   - Click "Download family"
   - Extract the ZIP file
   - Copy the `.woff2` files to this directory

2. **Required weights**:
   - `Inter-Light.woff2` (300)
   - `Inter-Regular.woff2` (400)
   - `Inter-SemiBold.woff2` (600)
   - `Inter-Bold.woff2` (700)
   - `Inter-Black.woff2` (900)

3. **Update CSS**:
   After downloading, update `css/style.css` to use local fonts:

   ```css
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 300;
     font-display: swap;
     src: url('../assets/fonts/Inter-Light.woff2') format('woff2');
   }
   
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 400;
     font-display: swap;
     src: url('../assets/fonts/Inter-Regular.woff2') format('woff2');
   }
   
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 600;
     font-display: swap;
     src: url('../assets/fonts/Inter-SemiBold.woff2') format('woff2');
   }
   
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 700;
     font-display: swap;
     src: url('../assets/fonts/Inter-Bold.woff2') format('woff2');
   }
   
   @font-face {
     font-family: 'Inter';
     font-style: normal;
     font-weight: 900;
     font-display: swap;
     src: url('../assets/fonts/Inter-Black.woff2') format('woff2');
   }
   ```

4. **Update HTML**:
   Remove or comment out the Google Fonts link in `index.html`:

   ```html
   <!-- <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet"> -->
   ```

### Alternative: Use Font Squirrel Webfont Generator

1. Download Inter from Google Fonts
2. Upload to https://www.fontsquirrel.com/tools/webfont-generator
3. Generate webfont kit
4. Use the generated files

### File Structure

```
assets/
└── fonts/
    ├── Inter-Light.woff2
    ├── Inter-Regular.woff2
    ├── Inter-SemiBold.woff2
    ├── Inter-Bold.woff2
    ├── Inter-Black.woff2
    └── README.md (this file)
```

### Benefits of Local Fonts

- ✅ No external CDN dependency
- ✅ Faster loading (no DNS lookup)
- ✅ Works offline
- ✅ Better privacy (no tracking)
- ✅ More reliable (no CDN outages)

