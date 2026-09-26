import React, { useState } from 'react';
import { ThemeMode } from '../types';
import { 
  X, 
  Search, 
  Copy, 
  Check, 
  Code2, 
  ExternalLink, 
  Sparkles,
  Layers,
  Link as LinkIcon,
  Play,
  MousePointerClick,
  FileCode2,
  Image,
  Globe
} from 'lucide-react';

export interface SnippetItem {
  id: string;
  name: string;
  category: 'links' | 'scripts' | 'buttons' | 'anchors' | 'forms' | 'media' | 'meta';
  description: string;
  code: string;
  badge?: string;
  isCdn?: boolean;
}

export const ALL_SNIPPETS_CATALOG: SnippetItem[] = [
  // Links & Stylesheets
  {
    id: 'link-css',
    name: 'Link Local Stylesheet',
    category: 'links',
    description: 'Standard link to local style.css file',
    code: '<link rel="stylesheet" href="style.css">',
    badge: 'CSS'
  },
  {
    id: 'link-suicss',
    name: 'SUI Framework 2.0 CSS',
    category: 'links',
    description: 'Modern, fast CSS framework by Suman with cards, buttons, modals, and utilities',
    code: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.css">',
    badge: 'SUI 2.0',
    isCdn: true
  },
  {
    id: 'link-tailwind',
    name: 'Tailwind CSS (Play CDN)',
    category: 'links',
    description: 'Utility-first CSS framework with full JIT compiler for instant class styles',
    code: '<script src="https://cdn.tailwindcss.com"></script>',
    badge: 'Tailwind',
    isCdn: true
  },
  {
    id: 'link-bootstrap',
    name: 'Bootstrap 5.3 CSS',
    category: 'links',
    description: 'Popular responsive grid and component library',
    code: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">',
    badge: 'Bootstrap',
    isCdn: true
  },
  {
    id: 'link-google-fonts',
    name: 'Google Fonts (Inter)',
    category: 'links',
    description: 'Clean modern typography with preconnect DNS optimization',
    code: '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
    badge: 'Typography',
    isCdn: true
  },
  {
    id: 'link-font-awesome',
    name: 'Font Awesome 6 Icons',
    category: 'links',
    description: 'Thousands of vector icons for buttons, headers, and UI',
    code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">',
    badge: 'Icons',
    isCdn: true
  },
  {
    id: 'link-animate-css',
    name: 'Animate.css',
    category: 'links',
    description: 'Ready-to-use cross-browser CSS animations (bounce, fadeIn, pulse, etc.)',
    code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">',
    badge: 'Animation',
    isCdn: true
  },
  {
    id: 'link-favicon',
    name: 'Favicon Icon',
    category: 'links',
    description: 'Standard shortcut icon link for browser tab',
    code: '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">',
    badge: 'Favicon'
  },
  {
    id: 'link-canonical',
    name: 'Canonical Link',
    category: 'links',
    description: 'Specify preferred canonical URL to prevent SEO duplicate content',
    code: '<link rel="canonical" href="https://example.com/">',
    badge: 'SEO'
  },
  {
    id: 'link-manifest',
    name: 'Web App Manifest',
    category: 'links',
    description: 'PWA Web App Manifest link for installable web app support',
    code: '<link rel="manifest" href="manifest.json">',
    badge: 'PWA'
  },

  // Scripts & JavaScript
  {
    id: 'script-src',
    name: 'Link Local Script',
    category: 'scripts',
    description: 'Standard link to local script.js file',
    code: '<script src="script.js"></script>',
    badge: 'JavaScript'
  },
  {
    id: 'script-suijs',
    name: 'SUI Framework 2.0 JavaScript',
    category: 'scripts',
    description: 'Interactive component logic for modals, toasts, drawers, and tabs',
    code: '<script src="https://cdn.jsdelivr.net/gh/Suman-11-web/SUI-FRAMEWORK.CSS@v2.0.0/dist/sui.min.js"></script>',
    badge: 'SUI 2.0',
    isCdn: true
  },
  {
    id: 'script-module',
    name: 'ES Module Script',
    category: 'scripts',
    description: 'Script tag with type="module" enabling import and export syntax',
    code: '<script type="module" src="main.js"></script>',
    badge: 'ESM'
  },
  {
    id: 'script-confetti',
    name: 'Canvas Confetti',
    category: 'scripts',
    description: 'High-performance celebratory confetti fireworks and bursts',
    code: '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>',
    badge: 'Visual FX',
    isCdn: true
  },
  {
    id: 'script-threejs',
    name: 'Three.js (3D WebGL)',
    category: 'scripts',
    description: 'Complete 3D library for meshes, cameras, lighting, and WebGL renders',
    code: '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
    badge: '3D Graphics',
    isCdn: true
  },
  {
    id: 'script-gsap',
    name: 'GSAP Animation Library',
    category: 'scripts',
    description: 'Professional high-speed JavaScript tweening and timeline animations',
    code: '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>',
    badge: 'Animation',
    isCdn: true
  },
  {
    id: 'script-axios',
    name: 'Axios HTTP Client',
    category: 'scripts',
    description: 'Promise-based HTTP client for fetching REST APIs',
    code: '<script src="https://cdn.jsdelivr.net/npm/axios@1.6.8/dist/axios.min.js"></script>',
    badge: 'HTTP',
    isCdn: true
  },
  {
    id: 'script-lodash',
    name: 'Lodash Utility Library',
    category: 'scripts',
    description: 'Modern utility library delivering modularity, performance & extras',
    code: '<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>',
    badge: 'Utility',
    isCdn: true
  },

  // Anchors & Links (All with inbuilt href attribute)
  {
    id: 'a-standard',
    name: 'Standard Link with href',
    category: 'anchors',
    description: 'Anchor link with required href attribute',
    code: '<a href="#">Click here</a>',
    badge: 'Link'
  },
  {
    id: 'a-blank',
    name: 'External Link (New Tab)',
    category: 'anchors',
    description: 'Secure link opening in a new tab with target="_blank" and rel protection',
    code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Visit Website</a>',
    badge: 'Target Blank'
  },
  {
    id: 'a-mail',
    name: 'Email Mailto Link',
    category: 'anchors',
    description: 'Clickable link that opens default mail client with recipient email',
    code: '<a href="mailto:hello@example.com">Contact Us</a>',
    badge: 'Email'
  },
  {
    id: 'a-tel',
    name: 'Telephone Phone Link',
    category: 'anchors',
    description: 'Clickable phone link that triggers phone dialer on mobile devices',
    code: '<a href="tel:+1234567890">Call Support</a>',
    badge: 'Phone'
  },
  {
    id: 'a-btn',
    name: 'Link Styled as Button',
    category: 'anchors',
    description: 'Anchor tag with button styling for primary calls-to-action',
    code: '<a href="#signup" class="btn btn-primary">Get Started</a>',
    badge: 'CTA'
  },
  {
    id: 'a-suibtn',
    name: 'Link Styled as SUI Button',
    category: 'anchors',
    description: 'Anchor tag with SUI Framework button styling',
    code: '<a href="#explore" class="sui-btn sui-btn-primary">Explore Now</a>',
    badge: 'SUI CTA'
  },
  {
    id: 'a-download',
    name: 'Download File Link',
    category: 'anchors',
    description: 'Link that prompts the browser to download the linked URL',
    code: '<a href="document.pdf" download="Guide.pdf">Download PDF</a>',
    badge: 'Download'
  },

  // Buttons
  {
    id: 'btn-standard',
    name: 'Standard Button',
    category: 'buttons',
    description: 'Button element with type="button" attribute',
    code: '<button type="button">Click Me</button>',
    badge: 'Standard'
  },
  {
    id: 'btn-primary',
    name: 'Primary Button',
    category: 'buttons',
    description: 'Standard primary action button with class="btn btn-primary"',
    code: '<button type="button" class="btn btn-primary">Primary Action</button>',
    badge: 'Primary'
  },
  {
    id: 'btn-secondary',
    name: 'Secondary Button',
    category: 'buttons',
    description: 'Neutral secondary action button',
    code: '<button type="button" class="btn btn-secondary">Cancel</button>',
    badge: 'Secondary'
  },
  {
    id: 'btn-suiprimary',
    name: 'SUI Primary Button',
    category: 'buttons',
    description: 'SUI Framework styled high-contrast primary button',
    code: '<button type="button" class="sui-btn sui-btn-primary">SUI Button</button>',
    badge: 'SUI 2.0'
  },
  {
    id: 'btn-suioutline',
    name: 'SUI Outline Button',
    category: 'buttons',
    description: 'SUI Framework subtle outline border button',
    code: '<button type="button" class="sui-btn sui-btn-outline">Outline Action</button>',
    badge: 'SUI Outline'
  },
  {
    id: 'btn-suidanger',
    name: 'SUI Danger Button',
    category: 'buttons',
    description: 'SUI Framework red warning/destructive action button',
    code: '<button type="button" class="sui-btn sui-btn-danger">Delete Item</button>',
    badge: 'Danger'
  },
  {
    id: 'btn-submit',
    name: 'Submit Form Button',
    category: 'buttons',
    description: 'Form submission trigger button with type="submit"',
    code: '<button type="submit" class="sui-btn sui-btn-primary">Submit Form</button>',
    badge: 'Submit'
  },
  {
    id: 'btn-icon',
    name: 'Accessible Icon Button',
    category: 'buttons',
    description: 'Icon button with aria-label for accessibility support',
    code: '<button type="button" class="btn-icon" aria-label="Refresh Page">\n  <i class="fa-solid fa-arrows-rotate"></i>\n</button>',
    badge: 'Accessible'
  },

  // Forms & Inputs
  {
    id: 'form-post',
    name: 'Form (POST method)',
    category: 'forms',
    description: 'HTML form with action and method="post"',
    code: '<form action="/submit" method="post">\n  <div class="form-group">\n    <label for="name">Your Name</label>\n    <input type="text" id="name" name="name" required placeholder="Enter name" />\n  </div>\n  <button type="submit" class="sui-btn sui-btn-primary">Send</button>\n</form>',
    badge: 'POST Form'
  },
  {
    id: 'input-text',
    name: 'Text Input with Placeholder',
    category: 'forms',
    description: 'Standard text input with name and placeholder attributes',
    code: '<input type="text" name="username" placeholder="Enter username..." />',
    badge: 'Input'
  },
  {
    id: 'input-email',
    name: 'Email Input',
    category: 'forms',
    description: 'Input with native email validation and mobile keyboard optimization',
    code: '<input type="email" name="email" placeholder="name@example.com" required />',
    badge: 'Email'
  },
  {
    id: 'input-password',
    name: 'Password Input',
    category: 'forms',
    description: 'Secure masked password input',
    code: '<input type="password" name="password" placeholder="Enter password" required />',
    badge: 'Security'
  },
  {
    id: 'input-checkbox',
    name: 'Checkbox with Label',
    category: 'forms',
    description: 'Accessible checkbox input wrapped in a label',
    code: '<label class="checkbox-label">\n  <input type="checkbox" name="remember" /> Remember my choice\n</label>',
    badge: 'Checkbox'
  },
  {
    id: 'select-dropdown',
    name: 'Select Dropdown',
    category: 'forms',
    description: 'Dropdown selection menu with option items',
    code: '<select name="category">\n  <option value="1">Option 1</option>\n  <option value="2">Option 2</option>\n  <option value="3">Option 3</option>\n</select>',
    badge: 'Select'
  },
  {
    id: 'textarea-input',
    name: 'Textarea Field',
    category: 'forms',
    description: 'Multi-line text input field with configurable rows',
    code: '<textarea name="comments" rows="4" placeholder="Write your message here..."></textarea>',
    badge: 'Textarea'
  },

  // Media
  {
    id: 'media-img',
    name: 'Responsive Image',
    category: 'media',
    description: 'Image with required src, alt, and lazy loading performance attribute',
    code: '<img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800" alt="Colorful Abstract Gradient" loading="lazy" style="max-width:100%; height:auto; border-radius:8px;" />',
    badge: 'Image'
  },
  {
    id: 'media-video',
    name: 'HTML5 Video Player',
    category: 'media',
    description: 'Video element with native playback controls and mp4 source',
    code: '<video controls width="100%" poster="poster.jpg">\n  <source src="video.mp4" type="video/mp4">\n  Your browser does not support HTML5 video.\n</video>',
    badge: 'Video'
  },
  {
    id: 'media-audio',
    name: 'HTML5 Audio Player',
    category: 'media',
    description: 'Audio element with playback controls',
    code: '<audio controls src="audio.mp3">Your browser does not support audio element.</audio>',
    badge: 'Audio'
  },
  {
    id: 'media-iframe',
    name: 'Embedded iframe',
    category: 'media',
    description: 'Responsive embedded frame with security parameters',
    code: '<iframe src="https://example.com" width="100%" height="400" frameborder="0" loading="lazy"></iframe>',
    badge: 'iframe'
  },

  // Meta Tags
  {
    id: 'meta-viewport',
    name: 'Viewport Meta Tag',
    category: 'meta',
    description: 'Essential tag for mobile-friendly responsive web design',
    code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    badge: 'Responsive'
  },
  {
    id: 'meta-opengraph',
    name: 'OpenGraph Social Card Meta',
    category: 'meta',
    description: 'Rich preview tags for social platforms (Twitter, LinkedIn, Discord, Facebook)',
    code: '<meta property="og:title" content="My Project Title">\n<meta property="og:description" content="Explore this project built with CodePulse">\n<meta property="og:image" content="https://example.com/banner.png">\n<meta property="og:type" content="website">',
    badge: 'Social SEO'
  }
];

interface AssetInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (code: string, itemName: string) => void;
  theme: ThemeMode;
}

export const AssetInsertModal: React.FC<AssetInsertModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  theme
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Items', icon: Sparkles },
    { id: 'links', label: 'CSS & Links', icon: LinkIcon },
    { id: 'scripts', label: 'JS & Scripts', icon: Play },
    { id: 'anchors', label: '<a> Links (href)', icon: Globe },
    { id: 'buttons', label: 'Buttons', icon: MousePointerClick },
    { id: 'forms', label: 'Forms & Inputs', icon: FileCode2 },
    { id: 'media', label: 'Media & Images', icon: Image },
    { id: 'meta', label: 'Meta & SEO', icon: Code2 }
  ];

  const filteredItems = ALL_SNIPPETS_CATALOG.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopy = (item: SnippetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.code);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleInsert = (item: SnippetItem) => {
    onInsert(item.code, item.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-4xl max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
          theme === 'dark' 
            ? 'bg-[#0f1422] border-neutral-800 text-neutral-100' 
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Insert Required Links, Buttons & Tags
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-semibold">
                  Pro Max Library
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                1-click insert stylesheets, CDNs, buttons, anchors with href, and complete HTML components
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0 bg-neutral-50/50 dark:bg-neutral-900/40">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search link, button, CDN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none transition ${
                theme === 'dark'
                  ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500'
                  : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Snippet Grid View */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-neutral-400 flex flex-col items-center justify-center">
              <Search className="w-8 h-8 mb-2 opacity-30" />
              <p className="font-semibold text-sm">No matching tags or links found</p>
              <p className="text-xs opacity-75 mt-1">Try another search keyword or switch categories</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleInsert(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  theme === 'dark'
                    ? 'bg-[#131929] border-neutral-800 hover:border-blue-500/60 hover:bg-[#161f33]'
                    : 'bg-white border-neutral-200/90 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Title & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.badge.includes('SUI') 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2.5">
                    {item.description}
                  </p>

                  {/* Code Snippet Box */}
                  <div className={`p-2 rounded-lg font-mono text-[11px] overflow-x-auto select-all ${
                    theme === 'dark' ? 'bg-[#0a0d16] text-emerald-400' : 'bg-neutral-100 text-emerald-700'
                  }`}>
                    <code>{item.code}</code>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80">
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Insert at cursor &rarr;
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopy(item, e)}
                      title="Copy code to clipboard"
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleInsert(item)}
                      className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700 transition"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center gap-2">
            <span>Tip: You can also type directly in editor:</span>
            <code className="bg-neutral-200/80 dark:bg-neutral-800 px-1 py-0.5 rounded text-[10px] font-mono text-blue-500">
              link:css
            </code>
            <code className="bg-neutral-200/80 dark:bg-neutral-800 px-1 py-0.5 rounded text-[10px] font-mono text-blue-500">
              link:suicss
            </code>
            <code className="bg-neutral-200/80 dark:bg-neutral-800 px-1 py-0.5 rounded text-[10px] font-mono text-blue-500">
              a:blank
            </code>
            <code className="bg-neutral-200/80 dark:bg-neutral-800 px-1 py-0.5 rounded text-[10px] font-mono text-blue-500">
              btn:primary
            </code>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
