const escaped = {
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

function replaceTag(tag) {
  return escaped[tag] || tag
}

function createGlob(glob = '') {
  return [
    `${glob}README.md`,
    `${glob}package.json`,
    `${glob}example/Example.html`,
  ]
}

function createApiGlob() {
  return [`docs/*.md`, `README.md`]
}

function unescape(str) {
  return String(str).replace(/&.+?;/g, match => unescaped[match] || match)
}

const unescaped = Object.keys(escaped).reduce(
  (unescaped, key) => ((unescaped[escaped[key]] = key), unescaped),
  {},
)

// Insert tag at desired regex group
// @param {regex}  regex - Regex expression
// @param {string} content - The content to replace
// @param {string} tag - The html tag name to insert
// @param {string} spanClass - The new tag class
// @param {string} parentTag - Add span class to parentClass with prefix 'has-'
function insertTag(regex, content, tag, spanClass = '', parentTag = null) {
  return content.replace(regex, (m, $1) => {
    if (parentTag) {
      return m
        .replace(`<${parentTag}`, `<${parentTag} class="has-${spanClass}" `)
        .replace($1, `<${tag} class="${spanClass}">${$1}</${tag}>`)
    }
    return m.replace($1, `<${tag} class="${spanClass}">${$1}</${tag}>`)
  })
}

const createBuffer = () => {
  const normalize = s => s.replace(/\r?\n|\r|\s/gm, '')
  return n => Buffer.from(normalize(n))
}

export {
  createGlob,
  createApiGlob,
  unescape,
  insertTag,
  unescaped,
  replaceTag,
  createBuffer,
}
