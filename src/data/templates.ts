import { StarterTemplate } from '../types';

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'hello-world',
    name: 'Real Browser Defaults',
    description: 'Clean native browser playground with authentic button, input, select controls, and live console output.',
    badge: 'Default',
    includeSui: false,
    html: `<h1>Real Browser Output</h1>
<p>Standard HTML elements rendered with native browser defaults:</p>

<div style="margin: 16px 0; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
  <button id="btn">Click Me</button>
  <input type="text" id="myInput" placeholder="Type here..." value="Hello Browser" />
  <select id="mySelect">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </select>
  <input type="file" id="myFile" />
</div>

<div style="margin: 16px 0; display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
  <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
    <input type="checkbox" id="myCheck" checked />
    <span>Native Checkbox</span>
  </label>
  <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
    <input type="radio" name="demoRadio" checked />
    <span>Radio 1</span>
  </label>
  <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
    <input type="radio" name="demoRadio" />
    <span>Radio 2</span>
  </label>
</div>

<div style="margin: 16px 0;">
  <textarea rows="3" cols="40" placeholder="Native multi-line textarea...">Native browser textarea</textarea>
</div>`,
    css: `/* Real Browser Playground
   Default light canvas and native Chrome controls (buttons, text inputs, selects, files).
   Write your custom CSS rules here: */

h1 {
  color: #1e293b;
  margin-top: 0;
}

p {
  color: #475569;
}`,
    js: `// Interactive button listener & Console verification
console.log("🚀 Real browser live preview ready! All buttons, inputs, and selects render with authentic Chrome defaults.");

const btn = document.getElementById("btn");
const input = document.getElementById("myInput");
const select = document.getElementById("mySelect");

if (btn) {
  btn.addEventListener("click", () => {
    const val = input ? input.value : "";
    const sel = select ? select.value : "";
    console.log("Button clicked! Input value:", val, "| Selected option:", sel);
  });
}

if (input) {
  input.addEventListener("input", (e) => {
    console.log("Input changed:", e.target.value);
  });
}

if (select) {
  select.addEventListener("change", (e) => {
    console.log("Select changed to:", e.target.value);
  });
}`
  },
  {
    id: 'sui-showcase',
    name: 'SUI.css Component Showcase',
    description: 'Rich showcase of SUI-FRAMEWORK.CSS buttons, cards, badges, alerts, and grid system.',
    badge: 'SUI.css',
    includeSui: true,
    html: `<div class="sui-container" style="max-width: 800px; margin: 0 auto; padding: 32px 16px;">
  <!-- SUI Header -->
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #2563eb; font-size: 2.4rem; font-weight: 800; margin-bottom: 8px;">
      SUI-FRAMEWORK.CSS
    </h1>
    <p style="color: #64748b; font-size: 1.1rem; max-width: 540px; margin: 0 auto;">
      A lightweight, modern CSS framework for rapid and elegant web development by Suman M.
    </p>
  </div>

  <!-- SUI Alert Component -->
  <div class="sui-alert sui-alert-info" id="alertBox" style="margin-bottom: 24px;">
    <strong>Welcome!</strong> SUI.css is pre-linked in your preview head. Start building effortlessly.
  </div>

  <!-- SUI Cards Grid -->
  <div class="sui-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
    <!-- Card 1 -->
    <div class="sui-card">
      <div class="sui-card-header">
        <span class="sui-badge sui-badge-primary">Interactive</span>
        <h3 style="margin-top: 8px;">Dynamic Counter</h3>
      </div>
      <div class="sui-card-body">
        <p style="color: #64748b;">Test live state updates using SUI buttons below:</p>
        <div style="font-size: 2.2rem; font-weight: 700; color: #1e293b; margin: 12px 0;" id="counterDisplay">0</div>
        <div style="display: flex; gap: 8px;">
          <button class="sui-btn sui-btn-primary" id="incBtn">+ Increment</button>
          <button class="sui-btn sui-btn-outline" id="decBtn">- Decrement</button>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="sui-card">
      <div class="sui-card-header">
        <span class="sui-badge sui-badge-success">Theme Ready</span>
        <h3 style="margin-top: 8px;">Color & Styles</h3>
      </div>
      <div class="sui-card-body">
        <p style="color: #64748b;">Includes clean palettes, elegant buttons, badges, and responsive containers.</p>
        <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 6px;">
          <button class="sui-btn sui-btn-success" id="successBtn">Success Toast</button>
          <button class="sui-btn sui-btn-warning" id="warnBtn">Warning</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SUI Footer Callout -->
  <div style="text-align: center; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
    <p style="margin: 0; color: #475569; font-weight: 500;">
      Crafted with SUI-FRAMEWORK.CSS • Created by <strong>Suman M</strong>
    </p>
  </div>
</div>`,
    css: `/* Custom overrides complementing SUI.css */
body {
  background-color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.sui-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sui-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.sui-alert {
  padding: 14px 18px;
  border-radius: 8px;
  font-size: 0.95rem;
}

.sui-alert-info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.sui-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sui-badge-primary {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.sui-badge-success {
  background-color: #dcfce7;
  color: #15803d;
}

.sui-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.sui-btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.sui-btn-primary:hover {
  background-color: #1d4ed8;
}

.sui-btn-outline {
  background-color: transparent;
  border-color: #cbd5e1;
  color: #334155;
}

.sui-btn-outline:hover {
  background-color: #f8fafc;
}

.sui-btn-success {
  background-color: #10b981;
  color: #ffffff;
}

.sui-btn-warning {
  background-color: #f59e0b;
  color: #ffffff;
}`,
    js: `// State management for showcase
let count = 0;
const counterDisplay = document.getElementById('counterDisplay');

document.getElementById('incBtn').addEventListener('click', () => {
  count++;
  counterDisplay.textContent = count;
  console.log('Counter incremented to:', count);
});

document.getElementById('decBtn').addEventListener('click', () => {
  count--;
  counterDisplay.textContent = count;
  console.log('Counter decremented to:', count);
});

document.getElementById('successBtn').addEventListener('click', () => {
  console.log('Success button clicked!');
  const alertBox = document.getElementById('alertBox');
  alertBox.className = 'sui-alert sui-alert-info';
  alertBox.innerHTML = '<strong>Success!</strong> Action completed at ' + new Date().toLocaleTimeString();
});

document.getElementById('warnBtn').addEventListener('click', () => {
  console.warn('Warning action triggered by user!');
  alert('Warning: Example notification triggered!');
});`
  },
  {
    id: 'calculator',
    name: 'Modern Glass Calculator',
    description: 'A fully functional interactive calculator with decimal points, operators, and clear display.',
    badge: 'Popular',
    includeSui: false,
    html: `<div class="calc-wrapper">
  <div class="calculator">
    <div class="screen" id="display">0</div>
    <div class="keypad">
      <button class="key op" data-action="clear">C</button>
      <button class="key op" data-action="backspace">⌫</button>
      <button class="key op" data-action="%">%</button>
      <button class="key op action" data-action="/">÷</button>

      <button class="key num" data-val="7">7</button>
      <button class="key num" data-val="8">8</button>
      <button class="key num" data-val="9">9</button>
      <button class="key op action" data-action="*">×</button>

      <button class="key num" data-val="4">4</button>
      <button class="key num" data-val="5">5</button>
      <button class="key num" data-val="6">6</button>
      <button class="key op action" data-action="-">−</button>

      <button class="key num" data-val="1">1</button>
      <button class="key num" data-val="2">2</button>
      <button class="key num" data-val="3">3</button>
      <button class="key op action" data-action="+">+</button>

      <button class="key num span-2" data-val="0">0</button>
      <button class="key num" data-val=".">.</button>
      <button class="key equals" id="equals">=</button>
    </div>
  </div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 50%, #1e293b, #0f172a);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.calc-wrapper {
  padding: 20px;
}

.calculator {
  width: 320px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.screen {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 20px 16px;
  font-size: 2.2rem;
  color: #f8fafc;
  text-align: right;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.key {
  border: none;
  background: rgba(51, 65, 85, 0.5);
  color: #f1f5f9;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.key:hover {
  background: rgba(71, 85, 105, 0.8);
  transform: translateY(-2px);
}

.key:active {
  transform: translateY(0);
}

.key.op {
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.6);
}

.key.action {
  color: #60a5fa;
  background: rgba(37, 99, 235, 0.15);
}

.key.equals {
  background: #2563eb;
  color: #ffffff;
}

.key.equals:hover {
  background: #1d4ed8;
}

.span-2 {
  grid-column: span 2;
}`,
    js: `let currentInput = "0";
let operator = null;
let previousInput = null;
const display = document.getElementById("display");

function updateDisplay() {
  display.textContent = currentInput;
}

document.querySelectorAll(".key.num").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.val;
    if (currentInput === "0" && val !== ".") {
      currentInput = val;
    } else {
      if (val === "." && currentInput.includes(".")) return;
      currentInput += val;
    }
    updateDisplay();
  });
});

document.querySelectorAll(".key.op").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "clear") {
      currentInput = "0";
      operator = null;
      previousInput = null;
    } else if (action === "backspace") {
      currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    } else if (action === "%") {
      currentInput = (parseFloat(currentInput) / 100).toString();
    } else {
      operator = action;
      previousInput = currentInput;
      currentInput = "0";
    }
    updateDisplay();
  });
});

document.getElementById("equals").addEventListener("click", () => {
  if (!operator || previousInput === null) return;
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let res = 0;

  switch (operator) {
    case "+": res = prev + curr; break;
    case "-": res = prev - curr; break;
    case "*": res = prev * curr; break;
    case "/": res = curr !== 0 ? prev / curr : "Error"; break;
  }

  currentInput = res.toString();
  operator = null;
  previousInput = null;
  updateDisplay();
  console.log("Calculation result:", res);
});`
  },
  {
    id: 'portfolio',
    name: 'Developer Portfolio',
    description: 'Clean modern developer portfolio with hero banner, tech stack chips, and contact form.',
    badge: 'Portfolio',
    includeSui: false,
    html: `<div class="portfolio-container">
  <header class="navbar">
    <div class="logo">Suman M</div>
    <nav>
      <a href="#about">About</a>
      <a href="#projects">Work</a>
      <a href="#contact" class="btn-contact">Contact</a>
    </nav>
  </header>

  <main>
    <section class="hero" id="about">
      <div class="tag">Frontend Architect & UI Designer</div>
      <h1>Building clean, resilient interfaces for the modern web.</h1>
      <p>Creator of SUI-FRAMEWORK.CSS. Passionate about performant developer tools, accessible user experiences, and fluid web animations.</p>
      <div class="actions">
        <a href="#projects" class="btn primary">View Projects</a>
        <a href="https://suman-11-web.github.io/SUI-FRAMEWORK.CSS/" target="_blank" class="btn secondary">Explore SUI.css</a>
      </div>
    </section>

    <section class="projects" id="projects">
      <h2>Featured Works</h2>
      <div class="grid">
        <div class="card">
          <div class="card-tag">CSS Framework</div>
          <h3>SUI-FRAMEWORK.CSS</h3>
          <p>A minimalist, ultra-fast CSS utility & component system designed for contemporary web apps.</p>
        </div>
        <div class="card">
          <div class="card-tag">Web App</div>
          <h3>Live Code Playground</h3>
          <p>In-browser code editor with instant iframe preview, multi-tab support, and project download.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>© 2026 Suman M • Instagram: @__suman._.007</p>
  </footer>
</div>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #090d16;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
}

.portfolio-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 0;
}

.logo {
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: #60a5fa;
}

nav a {
  color: #94a3b8;
  text-decoration: none;
  margin-left: 24px;
  font-size: 0.95rem;
  transition: color 0.2s;
}

nav a:hover { color: #f8fafc; }

.btn-contact {
  background: #1e293b;
  padding: 8px 16px;
  border-radius: 8px;
  color: #60a5fa !important;
}

.hero {
  padding: 60px 0 80px;
}

.tag {
  color: #38bdf8;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #f8fafc;
}

.hero p {
  font-size: 1.15rem;
  color: #94a3b8;
  max-width: 600px;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
}

.btn {
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.15s;
}

.btn:hover { transform: translateY(-2px); }

.btn.primary {
  background: #2563eb;
  color: white;
}

.btn.secondary {
  background: #1e293b;
  color: #cbd5e1;
}

.projects {
  padding: 40px 0;
  border-top: 1px solid #1e293b;
}

.projects h2 {
  font-size: 1.6rem;
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.2s;
}

.card:hover {
  border-color: #3b82f6;
}

.card-tag {
  font-size: 0.75rem;
  color: #60a5fa;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.card p {
  color: #94a3b8;
  font-size: 0.95rem;
}

footer {
  text-align: center;
  padding: 40px 0;
  color: #64748b;
  font-size: 0.85rem;
  border-top: 1px solid #1e293b;
  margin-top: 60px;
}`,
    js: `console.log("Portfolio loaded smoothly. Welcome!");
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});`
  },
  {
    id: 'login-card',
    name: 'Modern Auth / Login Page',
    description: 'Clean responsive login card with password visibility toggle and form validation.',
    badge: 'Auth',
    includeSui: false,
    html: `<div class="login-wrapper">
  <div class="card">
    <div class="header">
      <h2>Welcome Back</h2>
      <p>Enter your details to sign in to your account</p>
    </div>
    <form id="loginForm">
      <div class="field">
        <label for="email">Email Address</label>
        <input type="email" id="email" placeholder="name@example.com" required />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <div class="password-box">
          <input type="password" id="password" placeholder="••••••••" required />
          <button type="button" id="togglePass">Show</button>
        </div>
      </div>
      <div class="remember-row">
        <label><input type="checkbox" id="remember" /> Remember me</label>
        <a href="#forgot" id="forgotLink">Forgot password?</a>
      </div>
      <button type="submit" class="submit-btn" id="submitBtn">Sign In</button>
    </form>
    <div id="statusMessage" class="status-msg"></div>
  </div>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.header h2 {
  font-size: 1.6rem;
  color: #0f172a;
  margin: 0 0 8px;
}

.header p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 24px;
}

.field {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

input[type="email"], input[type="password"], input[type="text"] {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.password-box {
  position: relative;
}

.password-box button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 24px;
  color: #64748b;
}

.remember-row a {
  color: #2563eb;
  text-decoration: none;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.status-msg {
  margin-top: 16px;
  font-size: 0.9rem;
  text-align: center;
}`,
    js: `const passInput = document.getElementById("password");
const toggleBtn = document.getElementById("togglePass");
const form = document.getElementById("loginForm");
const status = document.getElementById("statusMessage");

toggleBtn.addEventListener("click", () => {
  if (passInput.type === "password") {
    passInput.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    passInput.type = "password";
    toggleBtn.textContent = "Show";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  status.textContent = "Logging in as " + email + "...";
  status.style.color = "#2563eb";
  console.log("Login submitted for:", email);

  setTimeout(() => {
    status.textContent = "✓ Successfully authenticated!";
    status.style.color = "#16a34a";
  }, 700);
});`
  },
  {
    id: 'navbar-template',
    name: 'Responsive Navbar',
    description: 'Sticky navigation bar with mobile hamburger menu toggle and animated drawer.',
    badge: 'Navigation',
    includeSui: false,
    html: `<header class="site-header">
  <div class="nav-container">
    <div class="brand">
      <span class="logo-mark">⚡</span>
      <span class="logo-name">SUI Hub</span>
    </div>

    <button class="nav-toggle" id="navToggle" aria-label="Toggle Navigation">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav class="nav-menu" id="navMenu">
      <a href="#home" class="nav-link active">Home</a>
      <a href="#features" class="nav-link">Features</a>
      <a href="#pricing" class="nav-link">Pricing</a>
      <a href="#docs" class="nav-link">Documentation</a>
      <div class="nav-actions">
        <button class="btn-primary" id="getStartedBtn">Get Started</button>
      </div>
    </nav>
  </div>
</header>

<main class="page-content">
  <section class="content-box">
    <h2>Mobile-First Responsive Navbar</h2>
    <p>Resize your preview to Mobile (375px) or Tablet (768px) to test the animated hamburger menu toggle!</p>
  </section>
</main>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
}

.site-header {
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 50;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.2rem;
  color: #38bdf8;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link:hover, .nav-link.active {
  color: #38bdf8;
}

.btn-primary {
  background: #0284c7;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.nav-toggle .bar {
  width: 24px;
  height: 2px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

@media (max-width: 768px) {
  .nav-toggle { display: flex; }
  .nav-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #0f172a;
    flex-direction: column;
    padding: 24px;
    gap: 20px;
    border-bottom: 1px solid #1e293b;
  }
  .nav-menu.open { display: flex; }
}

.page-content {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 24px;
  text-align: center;
}

.content-box {
  background: #1e293b;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.content-box h2 {
  margin-bottom: 12px;
  color: #38bdf8;
}

.content-box p {
  color: #94a3b8;
  line-height: 1.6;
}`,
    js: `const toggleBtn = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

toggleBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  console.log("Mobile nav toggled. State: " + navMenu.classList.contains("open"));
});

document.getElementById("getStartedBtn").addEventListener("click", () => {
  alert("Welcome! Thanks for trying out SUI Hub.");
});`
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Empty project to start creating from scratch.',
    badge: 'Empty',
    includeSui: false,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Project</title>
</head>
<body>
  <main>
    <h1>Start Building</h1>
    <p>Write your HTML, CSS, and JS to see live updates!</p>
  </main>
</body>
</html>`,
    css: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 40px;
  background-color: #ffffff;
  color: #1e293b;
}

h1 {
  color: #2563eb;
}`,
    js: `// Start writing your JavaScript here
console.log("Blank project initialized.");`
  }
];
