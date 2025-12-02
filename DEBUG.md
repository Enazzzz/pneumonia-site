# Debugging Guide - Animation Issues

## Quick Verification Steps

### 1. Open Browser Console (F12)
You should see these logs in order:

```
✅ GSAP core loaded
✅ ScrollTrigger loaded
✅ ScrollToPlugin loaded
[MAIN] 🚀 Initializing pneumonia site...
[MAIN] Initializing progress bar
[MAIN] ✅ Progress bar initialized
[MAIN] GSAP core loaded, registering plugins...
[MAIN] ✅ ScrollTrigger registered
[MAIN] ✅ ScrollToPlugin registered
[PARTICLES] Initializing particle system...
[PARTICLES] ✅ Initialized with 100 particles
[PARALLAX] Initializing with 3 layers
[PARALLAX] ✅ Initialized
[MAIN] Setting up hero intro animations
[MAIN] ✅ Hero intro animations set up
[MAIN] Setting up 4 bubble animations
[MAIN] ✅ Bubble animations set up
[MAIN] Setting up lungs breathing animation
[MAIN] ✅ Lungs breathing animation set up
[MAIN] ✅ GSAP animations initialized and ScrollTrigger refreshed
[MAIN] ✅ All modules loaded successfully
[MAIN] 🎉 Site initialization complete!
```

### 2. Check Network Tab
All files should load with **200 OK**:
- `js/libs/gsap.min.js`
- `js/libs/ScrollTrigger.min.js`
- `js/libs/ScrollToPlugin.min.js`
- `js/modules/particles.js`
- `js/modules/parallax.js`
- `js/modules/breathing.js`
- `js/modules/quiz.js`
- `js/main.js`

### 3. Verify Elements Exist
Run these in console:

```javascript
// Check hero elements
document.getElementById('hero') // Should return element
document.querySelector('.lung.left') // Should return element
document.querySelector('.lung.right') // Should return element

// Check particle canvas
document.getElementById('particle-bg') // Should return canvas element

// Check parallax layers
document.getElementById('parallax-layers') // Should return element
document.querySelectorAll('#parallax-layers .layer').length // Should be 3

// Check bubbles
document.querySelectorAll('#bubbles .b, #bubbles circle').length // Should be 4

// Check cards
document.querySelectorAll('.tilt').length // Should be 4
```

### 4. Test Animations Manually

```javascript
// Test GSAP
if (typeof gsap !== 'undefined') {
  gsap.to('#hero h1', { rotation: 360, duration: 2 });
  // Should rotate the title
}

// Test particles
if (window.particleSystem) {
  console.log('Particle system available');
  window.particleSystem.resume(); // Resume if paused
}

// Test parallax
if (window.parallaxSystem) {
  console.log('Parallax system available');
  window.parallaxSystem.enable(); // Enable if disabled
}

// Test ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.refresh(); // Refresh all triggers
  console.log('ScrollTrigger refreshed');
}
```

### 5. Check CSS Issues

```javascript
// Check if elements are visible
const hero = document.getElementById('hero');
console.log('Hero visible:', hero.offsetWidth > 0 && hero.offsetHeight > 0);
console.log('Hero computed style:', window.getComputedStyle(hero).display);

const canvas = document.getElementById('particle-bg');
console.log('Canvas visible:', canvas.offsetWidth > 0 && canvas.offsetHeight > 0);
console.log('Canvas z-index:', window.getComputedStyle(canvas).zIndex);
```

### 6. Common Issues & Fixes

#### Issue: No console logs appear
**Fix**: Check that scripts are loading. Look for 404 errors in Network tab.

#### Issue: "GSAP not loaded" warnings
**Fix**: 
1. Verify `js/libs/gsap.min.js` exists
2. Check file permissions
3. Try opening the file directly in browser

#### Issue: Elements not found warnings
**Fix**: 
1. Check HTML structure matches selectors
2. Ensure elements are in DOM before scripts run
3. Check for typos in IDs/classes

#### Issue: Animations not visible
**Fix**:
1. Check `prefers-reduced-motion` in OS settings (disable temporarily)
2. Verify elements have dimensions (width/height > 0)
3. Check z-index - elements might be behind others
4. Verify CSS isn't overriding transforms

#### Issue: Particles not showing
**Fix**:
1. Check canvas has width/height
2. Verify canvas is not behind other elements (z-index)
3. Check browser console for canvas errors
4. Try: `window.particleSystem.resume()`

#### Issue: Parallax not working
**Fix**:
1. Move mouse over hero section
2. Check layers exist: `document.querySelectorAll('#parallax-layers .layer').length`
3. Verify reduced motion is off
4. Try: `window.parallaxSystem.enable()`

### 7. Enable Debug Mode

Debug mode is enabled by default in `main.js`. To disable:

```javascript
// In js/main.js, change:
const DEBUG = true;
// to:
const DEBUG = false;
```

### 8. Force Re-initialization

If something isn't working, try:

```javascript
// Refresh ScrollTrigger
if (typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.refresh();
}

// Re-initialize particles
if (window.particleSystem) {
  window.particleSystem.resume();
}

// Re-initialize parallax
if (window.parallaxSystem) {
  window.parallaxSystem.enable();
}
```

### 9. Check Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may need vendor prefixes)
- **IE11**: Not supported (use modern browser)

### 10. Performance Issues

If animations are choppy:
1. Close other browser tabs
2. Disable browser extensions
3. Check CPU usage
4. Reduce particle count in `particles.js` (line 24)

## Still Not Working?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+F5)
3. **Try incognito/private mode** (disables extensions)
4. **Check browser console for errors**
5. **Verify all files are in correct locations**

