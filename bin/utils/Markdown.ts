export const noCase = (title) => {
    const noCase = require('no-case');
    return noCase(title);
}

export const table = (array, columns?) => {
  let table = ""
  // Generate column list
  const cols = columns
    ? columns.split(",")
    : Object.keys(array[0])

  // Generate table headers
  table += cols.join(" | ")
  table += "\r\n"

  // Generate table header seperator
  table += cols.map(function () {
    return '---'
  }).join(' | ')
  table += "\r\n"

  // Generate table body
  array.forEach(function (item) {
    table += cols.map(function (key) {
      return String(item[key] || "")
    }).join(" | ") + "\r\n"
  })

  // Return table
  return table
}


/**
 * @description # H1
 */
export const h1 = (title: any) => {
    return `# ${title}`;
}
/**
 * @description # H2
 */
export const h2 = (title: any) => {
    return `## ${title}`;
}
/**
 * @description # H3
 */
export const h3 = (title: any) => {
    return `### ${title}`;
}
/**
 * @description # H1
 */
export const h4 = (title: any) => {
    return `#### ${title}`;
}
/**
 * @description # H1
 */
export const h5 = (title: any) => {
    return `##### ${title}`;
}
/**
 * @description # H6
 */
export const h6 = (title: any) => {
    return `###### ${title}`;
}
/**
 * @description altH2
 * ```md
 * Alt-H2
 * ------
 * ```
 */
export const altH2 = (title: any) => {
    return `
        ${title}
        ------
    `;
}
/**
 * @description altH1
 * ```md
 * Alt-H1
 * ======
 * ```
 */
export const altH1 = (title: any) => {
    return `
${title}
======
    `;
}
/**
 * @description link
 * ```md
 * [I'm an inline-style link](https://www.google.com)
 * [I'm an inline-style link with title](https://www.google.com "Google's Homepage")
 * ```
 */
export const link = (title: any, url: any, alt?: any) => {
    return `[${title}](${url}${alt?' '+alt:''})`;
}

/**
 * @description code
 * ```md
 * [I'm an inline-style link](https://www.google.com)
 * [I'm an inline-style link with title](https://www.google.com "Google's Homepage")
 * ```
 */
export const code = (text: any, type = 'javascript', inline = false) => {
    if (inline) {
        return `\`${text}\``;
    }
    return `
    \`\`\`${type}
    ${text}
    \`\`\`
    `;
}