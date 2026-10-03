// =====================================================================
// Comprehensive HTML & CSS Code Reference Catalog
// Used for IntelliSense autocomplete, typing suggestions & Quick Reference
// =====================================================================

export const CODE_REFERENCE = {

  // =====================================
  // 1. HTML ELEMENTS / TAGS
  // =====================================

  htmlTags: {

    // Document structure
    document: {
      html: '<html lang="en"></html>',
      head: '<head></head>',
      title: '<title>Page Title</title>',
      body: '<body></body>',
      meta: '<meta charset="UTF-8">',
      link: '<link rel="stylesheet" href="style.css">',
      style: '<style></style>',
      base: '<base href="/">'
    },

    // Semantic elements
    semantic: {
      header: '<header></header>',
      nav: '<nav></nav>',
      main: '<main></main>',
      section: '<section></section>',
      article: '<article></article>',
      aside: '<aside></aside>',
      footer: '<footer></footer>',
      address: '<address></address>',
      search: '<search></search>',
      h1: '<h1>Heading</h1>',
      h2: '<h2>Heading</h2>',
      h3: '<h3>Heading</h3>',
      h4: '<h4>Heading</h4>',
      h5: '<h5>Heading</h5>',
      h6: '<h6>Heading</h6>',
      hgroup: '<hgroup><h1>Title</h1><p>Subtitle</p></hgroup>'
    },

    // Text elements
    text: {
      p: '<p>Paragraph</p>',
      div: '<div></div>',
      span: '<span>Text</span>',
      br: '<br>',
      hr: '<hr>',
      pre: '<pre>Preformatted text</pre>',
      blockquote: '<blockquote>Quote</blockquote>',
      q: '<q>Short quotation</q>',
      abbr: '<abbr title="HyperText Markup Language">HTML</abbr>',
      b: '<b>Bold text</b>',
      strong: '<strong>Important text</strong>',
      i: '<i>Italic text</i>',
      em: '<em>Emphasized text</em>',
      u: '<u>Underlined text</u>',
      s: '<s>Strikethrough text</s>',
      small: '<small>Small text</small>',
      mark: '<mark>Highlighted text</mark>',
      sub: '<sub>Subscript</sub>',
      sup: '<sup>Superscript</sup>',
      del: '<del>Deleted text</del>',
      ins: '<ins>Inserted text</ins>',
      code: '<code>console.log("Hello");</code>',
      kbd: '<kbd>Ctrl + S</kbd>',
      samp: '<samp>Output</samp>',
      var: '<var>x</var>',
      cite: '<cite>Book title</cite>',
      dfn: '<dfn>Definition</dfn>',
      time: '<time datetime="2026-10-03">October 3</time>',
      data: '<data value="123">Product</data>',
      wbr: '<wbr>',
      ruby: '<ruby>漢<rt>Kan</rt></ruby>',
      rt: '<rt>Pronunciation</rt>',
      rp: '<rp>(</rp>'
    },

    // Lists
    lists: {
      ul: '<ul><li>Item</li></ul>',
      ol: '<ol><li>Item</li></ol>',
      li: '<li>List item</li>',
      dl: '<dl><dt>Term</dt><dd>Description</dd></dl>',
      dt: '<dt>Term</dt>',
      dd: '<dd>Description</dd>'
    },

    // Links and media
    media: {
      a: '<a href="https://example.com">Link</a>',
      img: '<img src="image.jpg" alt="Description">',
      picture: '<picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="Image"></picture>',
      source: '<source src="video.mp4" type="video/mp4">',
      video: '<video controls width="640"><source src="video.mp4" type="video/mp4"></video>',
      audio: '<audio controls><source src="audio.mp3" type="audio/mpeg"></audio>',
      track: '<track src="subtitles.vtt" kind="subtitles" srclang="en">',
      iframe: '<iframe src="https://example.com" title="Example"></iframe>',
      embed: '<embed src="file.pdf" type="application/pdf">',
      object: '<object data="file.pdf" type="application/pdf"></object>',
      map: '<map name="imagemap"></map>',
      area: '<area shape="rect" coords="0,0,100,100" href="page.html" alt="Area">',
      canvas: '<canvas width="300" height="150"></canvas>'
    },

    // Tables
    tables: {
      table: '<table></table>',
      caption: '<caption>Table Title</caption>',
      thead: '<thead></thead>',
      tbody: '<tbody></tbody>',
      tfoot: '<tfoot></tfoot>',
      tr: '<tr></tr>',
      th: '<th scope="col">Heading</th>',
      td: '<td>Data</td>',
      colgroup: '<colgroup></colgroup>',
      col: '<col span="2">'
    },

    // Forms
    forms: {
      form: '<form action="/submit" method="post"></form>',
      label: '<label for="name">Name</label>',
      input: '<input type="text" id="name" name="name">',
      textarea: '<textarea rows="4" cols="30"></textarea>',
      button: '<button type="button">Click Me</button>',
      select: '<select><option value="1">Option</option></select>',
      option: '<option value="1">Option</option>',
      optgroup: '<optgroup label="Group"><option>Item</option></optgroup>',
      datalist: '<datalist id="suggestions"><option value="Apple"></datalist>',
      fieldset: '<fieldset></fieldset>',
      legend: '<legend>Personal Details</legend>',
      output: '<output>Result</output>',
      progress: '<progress value="50" max="100"></progress>',
      meter: '<meter value="0.7">70%</meter>'
    },

    // Interactive elements
    interactive: {
      details: '<details><summary>More information</summary><p>Content</p></details>',
      summary: '<summary>Click to expand</summary>',
      dialog: '<dialog open>Dialog content</dialog>',
      menu: '<menu><li>Menu item</li></menu>'
    },

    // Scripting and templates
    scripting: {
      script: '<script src="app.js" defer></script>',
      noscript: '<noscript>JavaScript is disabled.</noscript>',
      template: '<template><div>Template content</div></template>',
      slot: '<slot name="content"></slot>'
    },

    // Web components
    webComponents: {
      slot: '<slot></slot>',
      template: '<template></template>'
    }
  },

  // =====================================
  // 2. HTML GLOBAL ATTRIBUTES
  // =====================================

  htmlAttributes: {
    id: 'id="main"',
    class: 'class="container"',
    style: 'style="color: red;"',
    title: 'title="Tooltip text"',
    lang: 'lang="en"',
    dir: 'dir="ltr"',
    hidden: 'hidden',
    tabindex: 'tabindex="0"',
    contenteditable: 'contenteditable="true"',
    draggable: 'draggable="true"',
    spellcheck: 'spellcheck="true"',
    translate: 'translate="no"',
    accesskey: 'accesskey="s"',
    autofocus: 'autofocus',
    disabled: 'disabled',
    readonly: 'readonly',
    required: 'required',
    checked: 'checked',
    selected: 'selected',
    multiple: 'multiple',
    placeholder: 'placeholder="Enter text"',
    value: 'value="Hello"',
    name: 'name="username"',
    type: 'type="text"',
    href: 'href="https://example.com"',
    src: 'src="image.jpg"',
    alt: 'alt="Image description"',
    target: 'target="_blank"',
    rel: 'rel="noopener noreferrer"',
    download: 'download',
    width: 'width="300"',
    height: 'height="200"',
    min: 'min="0"',
    max: 'max="100"',
    step: 'step="1"',
    pattern: 'pattern="[A-Za-z]+"',
    maxlength: 'maxlength="50"',
    minlength: 'minlength="3"',
    autocomplete: 'autocomplete="on"',
    accept: 'accept="image/*"',
    action: 'action="/submit"',
    method: 'method="post"',
    enctype: 'enctype="multipart/form-data"',
    for: 'for="username"',
    rows: 'rows="5"',
    cols: 'cols="30"',
    colspan: 'colspan="2"',
    rowspan: 'rowspan="2"',
    scope: 'scope="col"',
    controls: 'controls',
    autoplay: 'autoplay',
    muted: 'muted',
    loop: 'loop',
    poster: 'poster="thumbnail.jpg"',
    preload: 'preload="metadata"',
    loading: 'loading="lazy"',
    decoding: 'decoding="async"',
    crossorigin: 'crossorigin="anonymous"',
    integrity: 'integrity="sha384-..."',
    async: 'async',
    defer: 'defer',
    charset: 'charset="UTF-8"',
    content: 'content="width=device-width, initial-scale=1.0"',
    media: 'media="screen"',
    rel_stylesheet: 'rel="stylesheet"',
    'aria-label': 'aria-label="Close"',
    'aria-hidden': 'aria-hidden="true"',
    'aria-expanded': 'aria-expanded="false"',
    'data-id': 'data-id="123"'
  },

  // =====================================
  // 3. CSS PROPERTIES WITH SAMPLE VALUES
  // =====================================

  cssProperties: {

    // A
    accentColor: 'accent-color: #2563eb;',
    alignContent: 'align-content: center;',
    alignItems: 'align-items: center;',
    alignSelf: 'align-self: flex-start;',
    all: 'all: unset;',
    animation: 'animation: fadeIn 1s ease-in-out;',
    animationDelay: 'animation-delay: 0.5s;',
    animationDirection: 'animation-direction: alternate;',
    animationDuration: 'animation-duration: 2s;',
    animationFillMode: 'animation-fill-mode: forwards;',
    animationIterationCount: 'animation-iteration-count: infinite;',
    animationName: 'animation-name: fadeIn;',
    animationPlayState: 'animation-play-state: running;',
    animationTimingFunction: 'animation-timing-function: ease;',
    appearance: 'appearance: none;',
    aspectRatio: 'aspect-ratio: 16 / 9;',

    // B
    backfaceVisibility: 'backface-visibility: hidden;',
    background: 'background: #ffffff;',
    backgroundAttachment: 'background-attachment: fixed;',
    backgroundBlendMode: 'background-blend-mode: multiply;',
    backgroundClip: 'background-clip: padding-box;',
    backgroundColor: 'background-color: #f5f5f5;',
    backgroundImage: 'background-image: url("image.jpg");',
    backgroundOrigin: 'background-origin: border-box;',
    backgroundPosition: 'background-position: center;',
    backgroundRepeat: 'background-repeat: no-repeat;',
    backgroundSize: 'background-size: cover;',
    blockSize: 'block-size: 200px;',
    border: 'border: 1px solid #000;',
    borderBlock: 'border-block: 1px solid black;',
    borderBottom: 'border-bottom: 1px solid #ddd;',
    borderBottomColor: 'border-bottom-color: red;',
    borderBottomLeftRadius: 'border-bottom-left-radius: 10px;',
    borderBottomRightRadius: 'border-bottom-right-radius: 10px;',
    borderCollapse: 'border-collapse: collapse;',
    borderColor: 'border-color: #ddd;',
    borderImage: 'border-image: none;',
    borderInline: 'border-inline: 1px solid black;',
    borderLeft: 'border-left: 2px solid blue;',
    borderRadius: 'border-radius: 12px;',
    borderRight: 'border-right: 1px solid black;',
    borderSpacing: 'border-spacing: 5px;',
    borderStyle: 'border-style: solid;',
    borderTop: 'border-top: 1px solid black;',
    borderTopLeftRadius: 'border-top-left-radius: 10px;',
    borderTopRightRadius: 'border-top-right-radius: 10px;',
    borderWidth: 'border-width: 1px;',
    bottom: 'bottom: 0;',
    boxDecorationBreak: 'box-decoration-break: clone;',
    boxShadow: 'box-shadow: 0 4px 12px rgba(0,0,0,.15);',
    boxSizing: 'box-sizing: border-box;',
    breakAfter: 'break-after: page;',
    breakBefore: 'break-before: page;',
    breakInside: 'break-inside: avoid;',
    captionSide: 'caption-side: bottom;',
    caretColor: 'caret-color: red;',
    clear: 'clear: both;',
    clipPath: 'clip-path: circle(50%);',
    color: 'color: #333333;',
    columnCount: 'column-count: 3;',
    columnGap: 'column-gap: 20px;',
    columnRule: 'column-rule: 1px solid #ddd;',
    columnSpan: 'column-span: all;',
    columnWidth: 'column-width: 200px;',
    columns: 'columns: 200px 3;',
    contain: 'contain: layout;',
    content: 'content: "Hello";',
    cursor: 'cursor: pointer;',

    // D
    direction: 'direction: ltr;',
    display: 'display: flex;',
    emptyCells: 'empty-cells: hide;',
    filter: 'filter: blur(2px);',
    flex: 'flex: 1;',
    flexBasis: 'flex-basis: 200px;',
    flexDirection: 'flex-direction: row;',
    flexFlow: 'flex-flow: row wrap;',
    flexGrow: 'flex-grow: 1;',
    flexShrink: 'flex-shrink: 1;',
    flexWrap: 'flex-wrap: wrap;',
    float: 'float: left;',
    font: 'font: 16px Arial, sans-serif;',
    fontFamily: 'font-family: Arial, sans-serif;',
    fontFeatureSettings: 'font-feature-settings: normal;',
    fontKerning: 'font-kerning: auto;',
    fontOpticalSizing: 'font-optical-sizing: auto;',
    fontSize: 'font-size: 16px;',
    fontStretch: 'font-stretch: normal;',
    fontStyle: 'font-style: italic;',
    fontVariant: 'font-variant: small-caps;',
    fontWeight: 'font-weight: 700;',
    gap: 'gap: 20px;',
    grid: 'grid: auto / 1fr 1fr;',
    gridArea: 'grid-area: 1 / 1 / 2 / 3;',
    gridAutoColumns: 'grid-auto-columns: 1fr;',
    gridAutoFlow: 'grid-auto-flow: row;',
    gridAutoRows: 'grid-auto-rows: minmax(100px, auto);',
    gridColumn: 'grid-column: 1 / 3;',
    gridColumnEnd: 'grid-column-end: 3;',
    gridColumnGap: 'grid-column-gap: 20px;',
    gridColumnStart: 'grid-column-start: 1;',
    gridGap: 'grid-gap: 20px;',
    gridRow: 'grid-row: 1 / 3;',
    gridRowEnd: 'grid-row-end: 3;',
    gridRowGap: 'grid-row-gap: 20px;',
    gridRowStart: 'grid-row-start: 1;',
    gridTemplate: 'grid-template: auto / 1fr 1fr;',
    gridTemplateAreas: 'grid-template-areas: "header header" "main aside";',
    gridTemplateColumns: 'grid-template-columns: repeat(3, 1fr);',
    gridTemplateRows: 'grid-template-rows: auto 1fr;',
    hangingPunctuation: 'hanging-punctuation: first;',
    height: 'height: 100px;',
    hyphens: 'hyphens: auto;',
    imageRendering: 'image-rendering: auto;',
    inlineSize: 'inline-size: 100%;',
    inset: 'inset: 0;',
    insetBlock: 'inset-block: 10px;',
    insetInline: 'inset-inline: 10px;',
    isolation: 'isolation: isolate;',
    justifyContent: 'justify-content: center;',
    justifyItems: 'justify-items: center;',
    justifySelf: 'justify-self: end;',
    left: 'left: 0;',
    letterSpacing: 'letter-spacing: 1px;',
    lineBreak: 'line-break: auto;',
    lineHeight: 'line-height: 1.5;',
    listStyle: 'list-style: square;',
    listStyleImage: 'list-style-image: none;',
    listStylePosition: 'list-style-position: inside;',
    listStyleType: 'list-style-type: disc;',

    // M
    margin: 'margin: 10px;',
    marginBlock: 'margin-block: 20px;',
    marginBottom: 'margin-bottom: 10px;',
    marginInline: 'margin-inline: auto;',
    marginLeft: 'margin-left: 10px;',
    marginRight: 'margin-right: 10px;',
    marginTop: 'margin-top: 10px;',
    mask: 'mask: url("mask.svg");',
    maxBlockSize: 'max-block-size: 500px;',
    maxHeight: 'max-height: 500px;',
    maxInlineSize: 'max-inline-size: 1200px;',
    maxWidth: 'max-width: 1200px;',
    minBlockSize: 'min-block-size: 100px;',
    minHeight: 'min-height: 100vh;',
    minInlineSize: 'min-inline-size: 200px;',
    minWidth: 'min-width: 200px;',
    mixBlendMode: 'mix-blend-mode: multiply;',
    objectFit: 'object-fit: cover;',
    objectPosition: 'object-position: center;',
    offset: 'offset: 20px;',
    opacity: 'opacity: 0.8;',
    order: 'order: 1;',
    orphans: 'orphans: 2;',
    outline: 'outline: 2px solid blue;',
    outlineColor: 'outline-color: blue;',
    outlineOffset: 'outline-offset: 4px;',
    outlineStyle: 'outline-style: solid;',
    outlineWidth: 'outline-width: 2px;',
    overflow: 'overflow: auto;',
    overflowAnchor: 'overflow-anchor: auto;',
    overflowWrap: 'overflow-wrap: break-word;',
    overflowX: 'overflow-x: hidden;',
    overflowY: 'overflow-y: auto;',
    overscrollBehavior: 'overscroll-behavior: contain;',
    padding: 'padding: 20px;',
    paddingBlock: 'padding-block: 10px;',
    paddingBottom: 'padding-bottom: 10px;',
    paddingInline: 'padding-inline: 20px;',
    paddingLeft: 'padding-left: 10px;',
    paddingRight: 'padding-right: 10px;',
    paddingTop: 'padding-top: 10px;',
    pageBreakAfter: 'page-break-after: always;',
    pageBreakBefore: 'page-break-before: always;',
    pageBreakInside: 'page-break-inside: avoid;',
    perspective: 'perspective: 1000px;',
    perspectiveOrigin: 'perspective-origin: center;',
    placeContent: 'place-content: center;',
    placeItems: 'place-items: center;',
    placeSelf: 'place-self: center;',
    pointerEvents: 'pointer-events: none;',
    position: 'position: relative;',
    quotes: 'quotes: "“" "”";',
    resize: 'resize: vertical;',
    right: 'right: 0;',
    rotate: 'rotate: 45deg;',
    rowGap: 'row-gap: 20px;',
    scale: 'scale: 1.1;',
    scrollBehavior: 'scroll-behavior: smooth;',
    scrollMargin: 'scroll-margin: 20px;',
    scrollPadding: 'scroll-padding: 20px;',
    scrollSnapAlign: 'scroll-snap-align: start;',
    scrollSnapStop: 'scroll-snap-stop: always;',
    scrollSnapType: 'scroll-snap-type: x mandatory;',
    scrollbarColor: 'scrollbar-color: #888 #eee;',
    scrollbarWidth: 'scrollbar-width: thin;',
    shapeOutside: 'shape-outside: circle(50%);',
    tabSize: 'tab-size: 4;',
    tableLayout: 'table-layout: fixed;',
    textAlign: 'text-align: center;',
    textAlignLast: 'text-align-last: center;',
    textDecoration: 'text-decoration: underline;',
    textDecorationColor: 'text-decoration-color: red;',
    textDecorationLine: 'text-decoration-line: underline;',
    textDecorationStyle: 'text-decoration-style: dashed;',
    textIndent: 'text-indent: 20px;',
    textOverflow: 'text-overflow: ellipsis;',
    textShadow: 'text-shadow: 2px 2px 4px #999;',
    textTransform: 'text-transform: uppercase;',
    textUnderlineOffset: 'text-underline-offset: 4px;',
    textWrap: 'text-wrap: balance;',
    touchAction: 'touch-action: pan-y;',
    transform: 'transform: translateX(10px);',
    transformOrigin: 'transform-origin: center;',
    transformStyle: 'transform-style: preserve-3d;',
    transition: 'transition: all 0.3s ease;',
    transitionDelay: 'transition-delay: 0.2s;',
    transitionDuration: 'transition-duration: 0.3s;',
    transitionProperty: 'transition-property: transform;',
    transitionTimingFunction: 'transition-timing-function: ease-in-out;',
    translate: 'translate: 10px 20px;',
    unicodeBidi: 'unicode-bidi: isolate;',
    userSelect: 'user-select: none;',
    verticalAlign: 'vertical-align: middle;',
    visibility: 'visibility: visible;',
    whiteSpace: 'white-space: nowrap;',
    widows: 'widows: 2;',
    width: 'width: 100%;',
    wordBreak: 'word-break: break-word;',
    wordSpacing: 'word-spacing: 2px;',
    wordWrap: 'word-wrap: break-word;',
    writingMode: 'writing-mode: vertical-rl;',
    zIndex: 'z-index: 10;',

    // Modern CSS
    colorScheme: 'color-scheme: light dark;',
    container: 'container: card / inline-size;',
    containerName: 'container-name: card;',
    containerType: 'container-type: inline-size;',
    fieldSizing: 'field-sizing: content;',
    interpolateSize: 'interpolate-size: allow-keywords;',
    textEmphasis: 'text-emphasis: filled;',
    textRendering: 'text-rendering: optimizeLegibility;',
    viewTransitionName: 'view-transition-name: page;',
    anchorName: 'anchor-name: --tooltip;',
    positionAnchor: 'position-anchor: --tooltip;',
    positionArea: 'position-area: bottom;',
    overlay: 'overlay: auto;',
    transitionBehavior: 'transition-behavior: allow-discrete;',
    animationComposition: 'animation-composition: add;'
  },

  // =====================================
  // 4. CSS SELECTORS
  // =====================================

  cssSelectors: {
    universal: '*',
    element: 'div',
    class: '.container',
    id: '#header',
    grouping: 'h1, h2, p',
    descendant: '.container p',
    child: '.container > p',
    adjacentSibling: 'h1 + p',
    generalSibling: 'h1 ~ p',
    attribute: '[type="text"]',
    attributeExists: '[disabled]',
    hover: ':hover',
    active: ':active',
    focus: ':focus',
    focusVisible: ':focus-visible',
    focusWithin: ':focus-within',
    firstChild: ':first-child',
    lastChild: ':last-child',
    nthChild: ':nth-child(2)',
    nthOfType: ':nth-of-type(2)',
    firstOfType: ':first-of-type',
    lastOfType: ':last-of-type',
    onlyChild: ':only-child',
    not: ':not(.active)',
    is: ':is(h1, h2, h3)',
    where: ':where(.container)',
    has: ':has(img)',
    checked: ':checked',
    disabled: ':disabled',
    enabled: ':enabled',
    required: ':required',
    optional: ':optional',
    valid: ':valid',
    invalid: ':invalid',
    empty: ':empty',
    root: ':root',
    target: ':target',
    before: '::before',
    after: '::after',
    placeholder: '::placeholder',
    selection: '::selection',
    marker: '::marker',
    backdrop: '::backdrop',
    fileSelectorButton: '::file-selector-button'
  },

  // =====================================
  // 5. CSS AT-RULES
  // =====================================

  cssAtRules: {
    import: '@import url("style.css");',
    charset: '@charset "UTF-8";',
    media: '@media (max-width: 768px) { }',
    supports: '@supports (display: grid) { }',
    container: '@container (min-width: 400px) { }',
    fontFace: '@font-face { font-family: "MyFont"; src: url("font.woff2"); }',
    keyframes: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
    layer: '@layer base, components, utilities;',
    namespace: '@namespace url("http://www.w3.org/1999/xhtml");',
    page: '@page { margin: 1cm; }',
    property: '@property --my-color { syntax: "<color>"; inherits: true; initial-value: red; }',
    startingStyle: '@starting-style { opacity: 0; }',
    counterStyle: '@counter-style custom { system: cyclic; symbols: "*"; }'
  },

  // =====================================
  // 6. COMMON CSS VALUES
  // =====================================

  cssValues: {
    display: [
      'block', 'inline', 'inline-block', 'flex', 'inline-flex',
      'grid', 'inline-grid', 'none', 'contents', 'flow-root',
      'table', 'list-item'
    ],

    position: [
      'static', 'relative', 'absolute', 'fixed', 'sticky'
    ],

    colors: [
      'red', 'blue', 'green', 'black', 'white', 'transparent',
      'currentColor', 'inherit', 'initial', 'unset',
      '#000000', '#ffffff', '#ff0000',
      'rgb(255, 0, 0)', 'rgba(0, 0, 0, 0.5)',
      'hsl(200, 100%, 50%)',
      'oklch(60% 0.15 250)'
    ],

    units: [
      'px', 'rem', 'em', '%', 'vh', 'vw', 'vmin', 'vmax',
      'dvh', 'dvw', 'svh', 'svw', 'lvh', 'lvw',
      'ch', 'ex', 'cm', 'mm', 'in', 'pt', 'pc',
      'fr', 'deg', 'rad', 'turn', 's', 'ms'
    ],

    flexDirection: [
      'row', 'row-reverse', 'column', 'column-reverse'
    ],

    flexWrap: [
      'nowrap', 'wrap', 'wrap-reverse'
    ],

    justifyContent: [
      'start', 'end', 'center', 'flex-start', 'flex-end',
      'space-between', 'space-around', 'space-evenly'
    ],

    alignItems: [
      'start', 'end', 'center', 'stretch', 'baseline',
      'flex-start', 'flex-end'
    ],

    fontWeight: [
      'normal', 'bold', 'bolder', 'lighter',
      '100', '200', '300', '400', '500',
      '600', '700', '800', '900'
    ],

    textAlign: [
      'left', 'right', 'center', 'justify', 'start', 'end'
    ],

    overflow: [
      'visible', 'hidden', 'scroll', 'auto', 'clip'
    ],

    cursor: [
      'auto', 'default', 'pointer', 'move', 'text',
      'wait', 'help', 'not-allowed', 'grab', 'grabbing',
      'crosshair', 'zoom-in', 'zoom-out', 'none'
    ],

    borderStyle: [
      'none', 'solid', 'dashed', 'dotted', 'double',
      'groove', 'ridge', 'inset', 'outset'
    ],

    transitionTiming: [
      'ease', 'linear', 'ease-in', 'ease-out',
      'ease-in-out', 'steps(4)', 'cubic-bezier(0.4, 0, 0.2, 1)'
    ],

    objectFit: [
      'fill', 'contain', 'cover', 'none', 'scale-down'
    ],

    backgroundSize: [
      'auto', 'cover', 'contain', '100% 100%'
    ],

    textDecoration: [
      'none', 'underline', 'overline', 'line-through'
    ],

    animationDirection: [
      'normal', 'reverse', 'alternate', 'alternate-reverse'
    ],

    boxSizing: [
      'content-box', 'border-box'
    ],

    visibility: [
      'visible', 'hidden', 'collapse'
    ],

    whiteSpace: [
      'normal', 'nowrap', 'pre', 'pre-wrap',
      'pre-line', 'break-spaces'
    ]
  }

};
