# Pneumonia Research Project — Interactive Presentation Site

A polished, animated, and highly accessible single-page website for a middle-school research project about **Pneumonia**. Built with vanilla HTML/CSS/JavaScript, featuring GSAP animations, interactive elements, and a comprehensive design system.

![Site Preview](assets/img/preview.png) <!-- TODO: Add preview image -->

---

## 🎯 Project Overview

This is a **zero-build, static site** that can be deployed directly to Vercel (or any static host) without any build process. The site features:

- ✨ **Beautiful animations** — GSAP-powered scroll triggers, parallax effects, and micro-interactions
- 🎨 **Modern design** — Glassmorphism, smooth gradients, and a cohesive color palette
- ♿ **Fully accessible** — WCAG AA compliant, keyboard navigation, screen reader support
- 📱 **Responsive** — Mobile-first design that works on all devices
- 🚀 **Performance optimized** — Fast load times, lazy loading, efficient animations
- 🎓 **Educational** — Interactive quiz, breathing demo, and clear content structure

---

## 📁 File Structure

```
pneumonia-site/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Comprehensive stylesheet with design tokens
├── js/
│   ├── main.js            # Main initialization script
│   └── modules/
│       ├── particles.js   # Particle background system
│       ├── parallax.js    # Mouse parallax effects
│       ├── breathing.js   # 4-7-8 breathing exercise demo
│       └── quiz.js        # Interactive quiz functionality
├── assets/
│   ├── svg/
│   │   └── lungs.svg      # Animated lungs illustration
│   └── img/               # Placeholder images (add your own)
├── data/
│   └── citations.md       # MLA citation examples and guide
├── vercel.json            # Vercel deployment configuration
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier code formatting
├── .editorconfig          # Editor configuration
├── LICENSE                # MIT License
└── README.md              # This file
```

---

## 🚀 Quick Start

### Local Development

1. **Clone or download** this repository
2. **Open `index.html`** in a modern browser (Chrome, Firefox, Safari, Edge)
3. **That's it!** No build process required.

For a local server (recommended for testing):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Deploy to Vercel

#### Option 1: Git Integration (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "init: pneumonia-site — polished animated template"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect settings (no build command needed)
   - Click "Deploy"

3. **Done!** Your site will be live at `your-project.vercel.app`

#### Option 2: Drag & Drop

1. **Zip the project folder** (excluding `node_modules` if any)
2. **Go to [vercel.com](https://vercel.com)**
3. **Drag and drop** the zip file
4. **Deploy!**

#### Option 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 🎨 Design System

### Color Palette

The site uses CSS custom properties (design tokens) defined in `css/style.css`. To customize colors, edit the `:root` variables:

```css
:root {
  /* Backgrounds */
  --bg-900: #0f1724;        /* Deepest background */
  --bg-800: #0b1220;        /* Panel/card background */
  
  /* Accents */
  --accent-1: #7b61ff;       /* Primary purple */
  --accent-2: #7be7ff;       /* Cyan highlight */
  
  /* Text */
  --text-primary: #E6EEF3;   /* Primary text */
  --text-secondary: #9aa8b2;  /* Muted text */
}
```

**Location**: `css/style.css` lines 1-100

### Typography

- **Font Family**: Inter (Google Fonts)
- **Scale**: Defined in CSS variables (`--font-size-*`)
- **Weights**: 300, 400, 600, 700, 900

### Spacing

8px base unit system:
- `--space-1` = 4px
- `--space-2` = 8px
- `--space-3` = 12px
- ... up to `--space-8` = 64px

### Breakpoints

- **Mobile**: Up to 640px
- **Tablet**: 641px - 860px
- **Desktop**: 861px+
- **Large**: 1100px+

---

## ✏️ How to Edit Content

### 1. Replace Placeholder Text

Search for `<!-- TODO:` in `index.html` to find all placeholder content. Replace with your research:

- **Hero section**: Title, subtitle, description
- **Symptoms**: Card content, add MLA citations
- **Transmission**: Causes and methods
- **Risk & Stats**: Update percentages with real data
- **Diagnosis**: Methods and descriptions
- **Treatment**: Options and details
- **Extras**: History and future content
- **Citations**: Add your MLA-formatted sources

### 2. Add Images

1. **Optimize images** to WebP format (use [Squoosh](https://squoosh.app/))
2. **Place in `assets/img/`**
3. **Update HTML**:
   ```html
   <img src="assets/img/your-image.webp" alt="Description" loading="lazy">
   ```

### 3. Update Citations

1. **Open `data/citations.md`** for MLA format examples
2. **Add citations to `index.html`** in the Citations section:
   ```html
   <li>
     <a href="https://example.com" target="_blank" rel="noopener noreferrer">
       Author. "Title." Source, Date, URL.
     </a>
   </li>
   ```

### 4. Customize Colors

Edit `css/style.css` at the top (`:root` section) to change:
- Background colors
- Accent colors
- Text colors
- Shadows and effects

### 5. Modify Animations

- **GSAP animations**: Edit `js/main.js`
- **Breathing demo**: Edit `js/modules/breathing.js`
- **Parallax**: Edit `js/modules/parallax.js`

---

## 🎭 Features Explained

### Breathing Demo (4-7-8 Exercise)

Located in `js/modules/breathing.js`. Implements:
- **Inhale**: 4 seconds (circle expands)
- **Hold**: 7 seconds (circle stays large)
- **Exhale**: 8 seconds (circle contracts)

**To customize**: Edit timing in `startBreathing()` function.

### Interactive Quiz

Located in `js/modules/quiz.js`. Features:
- Immediate feedback
- ARIA live regions for screen readers
- Keyboard navigation

**To add questions**: Add buttons with `data-correct="true"` or `data-correct="false"`.

### Particle System

Located in `js/modules/particles.js`. Creates a subtle animated background.

**To customize**: Edit `particleCount` and particle properties.

### Parallax Effects

Located in `js/modules/parallax.js`. Mouse movement creates depth effect.

**To disable**: Remove parallax script tag from HTML.

---

## ♿ Accessibility Features

### Implemented

- ✅ **Semantic HTML5** — Proper landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`)
- ✅ **ARIA labels** — All interactive elements have descriptive labels
- ✅ **Keyboard navigation** — All features accessible via keyboard
- ✅ **Skip link** — Jump to main content (visible on focus)
- ✅ **Focus indicators** — Clear focus styles on all interactive elements
- ✅ **Screen reader support** — ARIA live regions, roles, and descriptions
- ✅ **Reduced motion** — Respects `prefers-reduced-motion` media query
- ✅ **Color contrast** — WCAG AA compliant (4.5:1 minimum)

### Testing Checklist

Run these tests to verify accessibility:

1. **Keyboard Navigation**
   - [ ] Tab through all interactive elements
   - [ ] Enter/Space activates buttons
   - [ ] Focus is visible on all elements
   - [ ] Skip link appears when tabbing from top

2. **Screen Reader** (NVDA/JAWS/VoiceOver)
   - [ ] All headings are announced
   - [ ] Buttons have descriptive labels
   - [ ] Quiz feedback is announced
   - [ ] Breathing demo instructions are clear

3. **Reduced Motion**
   - [ ] Enable "Reduce motion" in OS settings
   - [ ] Animations are disabled or simplified
   - [ ] Site remains functional

4. **Color Contrast**
   - [ ] Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - [ ] All text meets WCAG AA (4.5:1)
   - [ ] Interactive elements have sufficient contrast

---

## 🎬 GSAP & ScrollSmoother

### Current Setup

The site uses **GSAP** (free) and **ScrollTrigger** (free) via CDN. These are loaded in `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
```

### ScrollSmoother (Optional, Paid)

**ScrollSmoother** is a Club GreenSock plugin that adds buttery-smooth scrolling. It requires a paid membership.

**To enable ScrollSmoother** (if you have a license):

1. **Add the script** (replace with your CDN or local file):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollSmoother.min.js"></script>
   ```

2. **Initialize in `js/main.js`**:
   ```javascript
   if (typeof ScrollSmoother !== 'undefined') {
     ScrollSmoother.create({
       wrapper: "#smooth-wrapper",
       content: "#smooth-content",
       smooth: 1.5,
       effects: true
     });
   }
   ```

3. **Wrap HTML**:
   ```html
   <div id="smooth-wrapper">
     <div id="smooth-content">
       <!-- All your content -->
     </div>
   </div>
   ```

**Note**: The site works perfectly without ScrollSmoother. It's an optional enhancement.

---

## 🛠️ Development Tools

### Code Formatting

**Prettier** is configured. To format code:

```bash
# Install Prettier (if not installed)
npm install -g prettier

# Format all files
prettier --write "**/*.{js,css,html,json}"
```

### Linting

**ESLint** is configured. To lint JavaScript:

```bash
# Install ESLint (if not installed)
npm install -g eslint

# Lint all JS files
eslint js/**/*.js
```

### Editor Setup

The project includes `.editorconfig` for consistent formatting across editors. Most modern editors (VS Code, WebStorm, etc.) support this automatically.

---

## 📊 Performance Targets

### Lighthouse Goals

- **Performance**: ≥ 80
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Optimization Tips

1. **Images**: Use WebP format, add `loading="lazy"` for below-fold images
2. **Fonts**: Preload critical font weights (already done in HTML)
3. **Animations**: Use `will-change` sparingly (already optimized)
4. **JavaScript**: Modular loading (already implemented)

---

## 🐛 Troubleshooting

### Animations Not Working

- **Check GSAP**: Ensure GSAP and ScrollTrigger are loaded
- **Console errors**: Open browser DevTools and check for errors
- **Reduced motion**: Check if OS has "Reduce motion" enabled

### Parallax Not Smooth

- **GPU acceleration**: Ensure `translate3d` is used (already implemented)
- **Performance**: Close other browser tabs
- **Browser**: Try Chrome or Firefox (best performance)

### Breathing Demo Not Starting

- **Check audio**: Browser may block audio until user interaction
- **Console errors**: Check for AudioContext errors
- **Mute button**: Ensure audio isn't muted

### Mobile Menu Not Working

- **JavaScript**: Ensure `js/main.js` is loaded
- **Touch events**: Test on actual device, not just browser DevTools

---

## 📚 Libraries & Dependencies

### Included (CDN)

- **GSAP 3.13.0** — Animation library
- **ScrollTrigger** — GSAP plugin for scroll-based animations
- **Inter Font** — Google Fonts (preloaded)

### No Build Tools Required

This is a **zero-dependency** static site. Everything runs in the browser.

---

## 🔄 Future Enhancements

Potential improvements (not implemented):

- [ ] Dark/Light theme toggle
- [ ] Chart.js integration for statistics
- [ ] More interactive visualizations
- [ ] Sound effects toggle (currently muted by default)
- [ ] Print stylesheet improvements
- [ ] PWA support (service worker, manifest)

---

## 📝 License

This project is licensed under the **MIT License**. See `LICENSE` file for details.

You are free to:
- Use for personal or commercial projects
- Modify and distribute
- Use as a template for other projects

---

## 🙏 Credits

- **GSAP** — [greensock.com](https://greensock.com/)
- **Inter Font** — [rsms.me/inter](https://rsms.me/inter/)
- **Design Inspiration** — Modern web design trends

---

## 📧 Support

If you encounter issues:

1. **Check the Troubleshooting section** above
2. **Review browser console** for errors
3. **Test in different browsers** (Chrome, Firefox, Safari)
4. **Verify file paths** are correct

---

## 🎓 For Students

### What to Customize

1. **Replace all `<!-- TODO:` comments** with your research
2. **Add real statistics** to risk bars and transmission charts
3. **Add MLA citations** in the Citations section
4. **Add images** (symptoms, x-rays, etc.) to `assets/img/`
5. **Customize colors** if desired (see Design System section)

### What NOT to Change

- **JavaScript structure** (unless you know what you're doing)
- **CSS design tokens** (unless customizing colors)
- **File names** (breaks references)

### Presentation Tips

- **Test on the actual device** you'll use for presentation
- **Practice navigating** with keyboard (accessibility demo)
- **Have a backup** (PDF export or screenshots)
- **Test internet connection** if deploying live

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] All placeholder text replaced
- [ ] Citations added and formatted
- [ ] Images optimized and added
- [ ] Tested in multiple browsers
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Performance checked (Lighthouse)
- [ ] Mobile responsive verified
- [ ] All links work
- [ ] Git repository initialized (if using Git)

---

**Built with ❤️ for educational purposes. Ready to deploy and impress!**
