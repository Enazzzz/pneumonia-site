# Changelog

## Major Polish & Refinement Update

### ✨ New Features

1. **Subtle Cursor System** (`js/modules/cursor.js`)
   - Replaced custom cursor with subtle, still default state
   - Brightens and shows clear affordance on interactive elements
   - Preserves native pointer behavior for accessibility
   - Desktop-only with graceful touch device fallback

2. **Global Particle System** (`js/modules/particles-global.js`)
   - Page-spanning particles visible across entire site
   - Scroll-reactive with velocity-based motion and inertia
   - Cursor interaction (repulsion, brightening)
   - Brightens near interactive controls automatically
   - Realistic damping and performance optimized

3. **Copy Protection** (`js/modules/copy-protection.js`)
   - Optional flag to disable text selection
   - Toggle via URL param `?nocopy=1` or localStorage
   - Documented with accessibility implications
   - Reversible via `window.disableCopyProtection()`

4. **Demo Override Mode**
   - URL param `?demo=1` or localStorage `demo-full-motion=true`
   - Temporarily enables full motion even with `prefers-reduced-motion`
   - Useful for presentations and demos

### 🔧 Improvements

1. **Card Tilt System**
   - Cards now hold orientation while hovered (even if cursor stops)
   - Smooth, consistent revert animation on pointer leave
   - Standardized easing: `power2.out` with 0.6s duration
   - Works across all card types (sym-card, diag-card, treat-card, risk-item)

2. **Lungs Animation**
   - Removed continuous breathing loop
   - Click animation now smooth with deliberate final state
   - No snapping - ends in gentle, persistent pose

3. **Pie/Donut Chart**
   - Slower, more graceful rotation (romantic pace)
   - Higher contrast colors for better visibility
   - Smooth cubic easing for organic feel
   - Continuous slow rotation after initial animation

4. **Repeatable Animations**
   - Card reveals now replay when scrolling back
   - Transmission bars and risk bars are repeatable
   - Charts replay on scroll return
   - Better for presentations and demos

5. **Consistent Snap-Back Animations**
   - All revert animations use standardized timing
   - Single cohesive easing profile across site
   - No instant snaps anywhere

### 🗑️ Removed

1. **Breathing Demo Module**
   - Removed `js/modules/breathing.js`
   - Removed all breathing UI from HTML
   - Removed breathing button from hero
   - Removed breathing section from treatment area

2. **Light Mode / Theme Toggle**
   - Removed `js/modules/theme-toggle.js`
   - Removed theme toggle button from navigation
   - Removed light theme CSS
   - Site now dark theme only

3. **Old Particle System**
   - Replaced `js/modules/particles.js` with `particles-global.js`
   - New system is page-spanning and scroll-reactive

### 📝 Files Changed

**New Files:**
- `js/modules/cursor.js`
- `js/modules/particles-global.js`
- `js/modules/copy-protection.js`

**Removed Files:**
- `js/modules/breathing.js` (functionality removed)
- `js/modules/theme-toggle.js` (functionality removed)
- `js/modules/custom-cursor.js` (replaced by cursor.js)
- `js/modules/particles.js` (replaced by particles-global.js)

**Updated Files:**
- `js/main.js` - Updated card tilt, lungs animation, module references
- `js/modules/charts.js` - Slower rotation, higher contrast colors, repeatable
- `index.html` - Removed breathing UI, updated script loading
- `css/style.css` - Removed theme toggle styles, updated cursor styles

### 🎯 Technical Details

- **Standardized Easing**: All snap-back animations use `power2.out` with 0.6s duration
- **Demo Override**: Checked via URL param or localStorage before respecting `prefers-reduced-motion`
- **Performance**: Particle system adapts to device capability (30-120 particles)
- **Accessibility**: All features respect reduced motion unless demo override is active

### 📚 Documentation

- Updated README with:
  - Demo override instructions
  - Copy protection toggle instructions
  - Particle density adjustment
  - How to restore light mode (if needed)

---

**Note**: All changes are reversible and documented. The site maintains full accessibility and performance standards.

