// Direct rip from: https://github.com/vuejs/vue-loader
const postcss = require('postcss')

export const AddScopeIdPlugin = postcss.plugin('add-scope-id', function (opts) {
  const selectorParser = require('postcss-selector-parser')
  return function (root) {
    const keyframes = Object.create(null)

    root.each(function rewriteSelector (node) {
      if (!node.selector) {
        // handle media queries
        if (node.type === 'atrule') {
          if (node.name === 'media' || node.name === 'supports') {
            node.each(rewriteSelector)
          } else if (/-?keyframes$/.test(node.name)) {
            // register keyframes
            keyframes[node.params] = node.params = node.params + '-' + opts.id
          }
        }
        return
      }

      node.selector = selectorParser(function (selectors) {
        selectors.each(function (selector) {
          let node = null
          selector.each(function (n) {
            // ">>>" combinator
            if (n.type === 'combinator' && n.value === '>>>') {
              n.value = ' '
              n.spaces.before = n.spaces.after = ''
              return false
            }
            // /deep/ alias for >>>, since >>> doesn't work in SASS
            if (n.type === 'tag' && n.value === '/deep/') {
              let next = n.next()
              if (next.type === 'combinator' && next.value === ' ') {
                next.remove()
              }
              n.remove()
              return false
            }
            if (n.type !== 'pseudo' && n.type !== 'combinator') {
              node = n
            }
          })
          selector.insertAfter(node, selectorParser.attribute({
            attribute: opts.id
          }))
        })
      }).processSync(node.selector)
    })

    // If keyframes are found in this <style>, find and rewrite animation names
    // in declarations.
    // Caveat: this only works for keyframes and animation rules in the same
    // <style> element.
    if (Object.keys(keyframes).length) {
      root.walkDecls(decl => {
        // individual animation-name declaration
        if (/-?animation-name$/.test(decl.prop)) {
          decl.value = decl.value.split(',')
            .map(v => keyframes[v.trim()] || v.trim())
            .join(',')
        }
        // shorthand
        if (/-?animation$/.test(decl.prop)) {
          decl.value = decl.value.split(',')
            .map(v => {
              const vals = v.split(/\s+/);
              const name = vals[0];

              if (keyframes[name]) {
                return [keyframes[name]].concat(vals.slice(1)).join(' ')
              } else {
                return v
              }
            })
            .join(',')
        }
      })
    }
  }
});

export const TrimPlugin = postcss.plugin('trim', function (opts) {
  return function (css) {
    css.walk(function (node) {
      if (node.type === 'rule' || node.type === 'atrule') {
        node.raws.before = node.raws.after = '\n'
      }
    })
  }
});
