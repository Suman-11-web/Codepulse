# ⚡ SUI CodePulse Studio

> **A World-Class, Ultra-Premium Web IDE & Live Playground for HTML, CSS, and JavaScript.**  
> Designed, Architected, and Built by **Suman M** ([@\_\_suman.\_.007](https://www.instagram.com/__suman._.007)).

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![SUI Framework](https://img.shields.io/badge/Powered%20By-SUI--FRAMEWORK.CSS%20v2.0-blue?style=for-the-badge)](https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](#license)

---

## 🌟 Overview & Product Review

**SUI CodePulse Studio** is an advanced, in-browser front-end development environment engineered to bridge the gap between quick online sandboxes (like CodePen and JSFiddle) and full-scale desktop editors (like VS Code). It delivers an instant, zero-latency feedback loop with real-time compilation, isolated sandboxed execution, deep Chrome DevTools-style inspection, visual CSS generators, and accessibility audits.

Powered natively by **SUI-FRAMEWORK.CSS v2.0.0**, CodePulse provides developers with ready-to-use modern components, utilities, and rapid prototyping workflows.

---

## 🚀 Key Features

### 1. 🔍 Interactive DOM & Elements Inspector (Chrome DevTools in Preview)
* **Hover Element Picker**: Click the **Inspect** crosshair tool to outline any element in the live preview with an interactive blueprint overlay showing tag names, classes, IDs, and pixel dimensions.
* **Hierarchical DOM Tree Viewer**: Browse the full HTML tree in a bottom dock drawer with collapsible nodes, syntax-colored attributes, text previews, and node selection.
* **Visual Box Model Diagram**: Interactive visualization of **Margin** (amber), **Border** (yellow), **Padding** (green), and **Content** (blue) with real-time computed pixel metrics.
* **Computed Styles Table**: Searchable, filterable inspector for all applied CSS properties (display, flexbox, colors, typography, shadows, transitions).

### 2. 🎨 Visual CSS Studio & Generator
* **Box Shadow Designer**: Real-time sliders for horizontal/vertical offsets, blur, spread radius, color picker, alpha opacity, and inset toggle with live 3D preview cards.
* **Gradient Studio**: Build linear and radial gradients with customizable angle dials, multi-stop positions, color pickers, and curated presets (*SUI Sunset*, *Cyberpunk Neon*, *Emerald Mint*, *Midnight Obsidian*).
* **Glassmorphism & Frosted Glass**: Adjust backdrop-blur, background alpha, border opacity, and border-radius with immediate preview over vivid mesh gradients.
* **1-Click Insertion**: Insert generated CSS rules directly at the cursor in your stylesheet or copy to clipboard.

### 3. 🛡️ Code Health, Linter & Accessibility (WCAG 2.1 AA) Auditor
* **Real-time Diagnostic Scanner**:
  * Accessibility: Validates missing `alt` on `<img>`, empty or missing `href` on `<a>`, unlabelled icon buttons, and unassociated form inputs.
  * HTML Quality: Detects duplicate element IDs, deprecated legacy tags (`<font>`, `<center>`, `<marquee>`), and unclosed tags.
  * CSS Best Practices: Identifies empty selectors and excessive `!important` rule overrides.
* **Health Score Gauge**: Real-time score (0–100%) and letter grade (A+, A, B, C, D) in the status bar.
* **1-Click Auto-Fix**: Automatically patches common accessibility issues, inserts required attributes, removes dead CSS, and formats code with one tap.

### 4. 📱 Live Mobile Testing (QR Code) & Device Viewport Tools
* **Instant Phone Testing via QR Code**: Click **Mobile QR** to generate a crisp vector QR code of your running project. Scan with any iOS or Android camera to run and interact with your app live on your physical smartphone.
* **Device Orientation Switcher**: 1-click toggle between **Portrait** (375×667 / 768×1024) and **Landscape** (667×375 / 1024×768) for mobile and tablet simulation.
* **Sandboxed Multi-Screen Simulator**: Toggle between Desktop (100%), Tablet (768px), and Mobile (375px) viewports with sandbox security.

### 5. ⚡ Inbuilt Link, Script, Button & Tag Snippet Engine
* Type short Emmet-style prefixes followed by `Tab` or `Enter` to expand complete, production-ready tags:
  * **Links**: `link:css`, `link:suicss`, `link:bootstrap`, `link:font`, `link:fontawesome`, `link:animate`, `link:favicon`, `link:manifest`.
  * **Scripts**: `link:js`, `script:src`, `script:suijs`, `script:tailwind`, `script:three`, `script:gsap`, `script:module`, `script:defer`.
  * **Buttons**: `btn`, `btn:primary`, `btn:secondary`, `btn:sui`, `btn:danger`, `btn:outline`, `button:submit`.
  * **Anchors**: `<a>` tags automatically include required `href`, plus `a:blank`, `a:external`, `a:btn`, `a:mail`, `a:tel`, `a:download`.
* **Zero Quote-Glitch Guarantee**: Tag suggestions are strictly suppressed inside quotes and string attributes.

### 6. 💻 Developer REPL Console & Deep Serialization
* Captures `console.log`, `info`, `warn`, `error`, `debug`, `time/timeEnd`, `count`, and `assert`.
* **Interactive JSON Tree**: Expandable key-value disclosure triangles for objects and arrays.
* **Tabular Data (`console.table`)**: Formatted data grid viewer.
* **Live REPL Evaluator**: Interactive command prompt supporting `document.querySelector` (`$()`), `$$()`, math expressions, and DOM manipulation.

### 7. 💾 Project Management & Exports
* **Full ZIP Export**: Downloads clean standalone `index.html`, `style.css`, `script.js`, and `README.txt`.
* **Standalone HTML**: 1-click export of an all-in-one bundled `.html` file.
* **URL State Sharing**: Compress entire workspace into a shareable URL hash.
* **Local Storage Persistence**: Auto-saves projects continuously to prevent data loss.

---

## 📖 User Manual & How-To Guide

### Getting Started
1. **Writing Code**: Enter your HTML, CSS, and JavaScript into their respective panels. The live preview updates automatically as you type.
2. **Formatting Code**: Press `Shift+Alt+F` or click **Format** in the top bar to format all code with Prettier and JS-Beautify.
3. **Running Code**: Press `Ctrl+Enter` to force an immediate refresh.

### Using the Elements Inspector
1. Click **Inspect** (crosshair icon) in the preview header or bottom dock.
2. Hover over any element in the live preview to view its bounding box and tag name.
3. Click the element to inspect its full DOM node, visual Box Model dimensions, and live computed CSS rules.

### Using the Visual CSS Studio
1. Click **CSS Studio** in the top header or status bar.
2. Switch between **Box Shadow**, **Gradient**, and **Glassmorphism** tabs.
3. Adjust sliders or select quick presets to watch the interactive preview update in real time.
4. Click **Insert into CSS Editor** to append the rule directly to your stylesheet.

### Testing on Your Mobile Phone
1. Click **Mobile QR** in the preview toolbar.
2. Open your smartphone camera and point it at the QR code.
3. Tap the link banner to view and test your live project directly in mobile Safari or Chrome.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Enter` / `Cmd + Enter` | Run & Refresh Preview |
| `Shift + Alt + F` | Format All Code (HTML, CSS, JS) |
| `Ctrl + K` / `Cmd + K` | Open Command Palette |
| `Ctrl + S` / `Cmd + S` | Save Project to Local Storage |
| `Ctrl + O` / `Cmd + O` | Open Saved Projects & Starter Templates |
| `Ctrl + F` / `Cmd + F` | Search & Replace in Active Editor |
| `Alt + Z` | Toggle Word Wrap |

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: React 19, TypeScript
* **Editor Core**: CodeMirror 6 (`@codemirror/state`, `@codemirror/view`, `@codemirror/autocomplete`)
* **Styling**: Tailwind CSS v4, SUI-FRAMEWORK.CSS v2.0.0
* **Bundler & Tooling**: Vite, ESBuild, PostCSS
* **Icons**: Lucide React
* **QR Engine**: QRCode (Vector SVG generator)
* **Zip Archiver**: JSZip

---

## 🚢 Vercel Deployment Instructions

Deploying **SUI CodePulse Studio** to Vercel takes less than 60 seconds:

### Option 1: Vercel CLI
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy from project root
vercel
```

### Option 2: GitHub Integration
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of SUI CodePulse Studio"
   git remote add origin https://github.com/your-username/sui-codepulse-studio.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel will auto-detect **Vite**:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
5. Click **Deploy**!

---

## 👨‍💻 Author & Lead Developer

* **Developer**: **Suman M**
* **Instagram**: [@\_\_suman.\_.007](https://www.instagram.com/__suman._.007)
* **Framework**: [SUI-FRAMEWORK.CSS](https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/)
* **Project**: SUI CodePulse Studio

---

## 📄 License

Distributed under the MIT License. Feel free to use, modify, and contribute to the project.
