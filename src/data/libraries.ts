import { ExternalLibrary } from '../types';
import { SUI_CSS_CDN, SUI_JS_CDN } from '../utils/fileUtils';

export const POPULAR_LIBRARIES: ExternalLibrary[] = [
  {
    id: 'sui',
    name: 'SUI Framework',
    category: 'css',
    description: 'Modern, lightweight UI Framework by Suman M featuring cards, modals, grids and responsive components.',
    cssUrl: SUI_CSS_CDN,
    jsUrl: SUI_JS_CDN,
    enabled: false,
    version: 'v2.0.0',
    badge: 'UI Kit'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS (Play CDN)',
    category: 'css',
    description: 'Utility-first CSS framework for rapid modern UI development without leaving your HTML.',
    jsUrl: 'https://cdn.tailwindcss.com',
    enabled: false,
    version: 'v3.4',
    badge: 'Popular'
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap 5',
    category: 'css',
    description: 'Powerful, extensible, and feature-packed frontend toolkit with responsive grid and components.',
    cssUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    jsUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    enabled: false,
    version: 'v5.3.3'
  },
  {
    id: 'fontawesome',
    name: 'Font Awesome 6',
    category: 'font',
    description: 'Icon library with thousands of scalable vector icons and social media glyphs.',
    cssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    enabled: false,
    version: 'v6.5.1'
  },
  {
    id: 'lucide',
    name: 'Lucide Icons',
    category: 'js',
    description: 'Beautiful & consistent open-source icon suite for vanilla JS and modern websites.',
    jsUrl: 'https://unpkg.com/lucide@latest',
    enabled: false,
    version: 'Latest'
  },
  {
    id: 'animate',
    name: 'Animate.css',
    category: 'css',
    description: 'Cross-browser collection of ready-to-use CSS animations for your projects.',
    cssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
    enabled: false,
    version: 'v4.1.1'
  },
  {
    id: 'gsap',
    name: 'GSAP 3 (GreenSock)',
    category: 'js',
    description: 'Ultra high-performance professional JavaScript animation for the modern web.',
    jsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    enabled: false,
    version: 'v3.12.5',
    badge: 'Animation'
  },
  {
    id: 'threejs',
    name: 'Three.js (3D Graphics)',
    category: 'js',
    description: 'Easy to use, lightweight, 3D library with a default WebGL renderer.',
    jsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    enabled: false,
    version: 'r128',
    badge: '3D WebGL'
  },
  {
    id: 'chartjs',
    name: 'Chart.js',
    category: 'js',
    description: 'Simple yet flexible JavaScript charting library for designers and developers.',
    jsUrl: 'https://cdn.jsdelivr.net/npm/chart.js',
    enabled: false,
    version: 'v4.4'
  },
  {
    id: 'jquery',
    name: 'jQuery',
    category: 'js',
    description: 'Fast, small, and feature-rich JavaScript DOM manipulation library.',
    jsUrl: 'https://code.jquery.com/jquery-3.7.1.min.js',
    enabled: false,
    version: 'v3.7.1'
  },
  {
    id: 'axios',
    name: 'Axios',
    category: 'js',
    description: 'Promise-based HTTP client for making REST API calls in browser JavaScript.',
    jsUrl: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    enabled: false,
    version: 'v1.6.8'
  },
  {
    id: 'google-fonts',
    name: 'Google Fonts (Inter & Fira Code)',
    category: 'font',
    description: 'Crisp modern typography for clean UI interfaces and monospace code rendering.',
    cssUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap',
    enabled: false,
    version: 'Fonts'
  }
];
