
// For perf reasons, this script is run inline to quickly set certain styles.
// To allow CSP to work correctly, we also calculate a sha256 hash during
// the build process and write it to inline-script-checksum.json.

import { testHasLocalStorageOnce } from './src/routes/_utils/testStorage'
import { switchToTheme } from './src/routes/_utils/themeEngine'

window.__themeColors = process.env.THEME_COLORS

function safeParse (str) {
  return str === 'undefined' ? undefined : JSON.parse(str)
}

const hasLocalStorage = testHasLocalStorageOnce()
const currentInstance = hasLocalStorage &&
  localStorage.store_currentInstance &&
  safeParse(localStorage.store_currentInstance)

if (currentInstance && localStorage.store_instanceThemes) {
  let theme = safeParse(localStorage.store_instanceThemes)[safeParse(localStorage.store_currentInstance)]
  if (theme && theme !== 'default') {
    switchToTheme(theme)
  }
}

if (!hasLocalStorage || !currentInstance) {
  // if not logged in, show all these 'hidden-from-ssr' elements
  let style = document.createElement('style')
  style.textContent = '.hidden-from-ssr { opacity: 1 !important; }'
  document.head.appendChild(style)
}

if (hasLocalStorage && localStorage.store_disableCustomScrollbars === 'true') {
  // if user has disabled custom scrollbars, remove this style
  let theScrollbarStyle = document.getElementById('theScrollbarStyle')
  theScrollbarStyle.setAttribute('media', 'only x') // disables the style
}

// hack to make the scrollbars rounded only on macOS
if (/mac/i.test(navigator.platform)) {
  document.documentElement.style.setProperty('--scrollbar-border-radius', '50px')
}

// TODO: remove this hack when Safari works with cross-origin window.open()
// in a PWA: https://github.com/nolanlawson/pinafore/issues/45
if (/iP(?:hone|ad|od)/.test(navigator.userAgent)) {
  document.head.removeChild(document.getElementById('theManifest'))
}
