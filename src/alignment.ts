import extend = require('xtend')
import escape = require('escape-string-regexp')
import repeat = require('repeat-string')

export interface Options {
  leftSeparators?: string[]
  rightSeparators?: string[]
  ignoreSeparators?: string[]
  spaceSeparators?: string[]
}

export const DEFAULT_OPTIONS: Options = {
  leftSeparators: [':'],
  rightSeparators: ['=', '+=', '-=', '*=', '/=', '?=', '|=', '%=', '.=', '=>'],
  spaceSeparators: ['=', '+=', '-=', '*=', '/=', '?=', '|=', '%=', '.=', '=>'],
  ignoreSeparators: ['::']
}

export type Cursor = [number, number]
export type AlignmentResult = [string, Cursor[]]

/**
 * Check for empty values.
 */
function isEmpty (value: string) {
  return !!value
}

/**
 * Function to sort two strings by string length.
 */
function sortLength (a: string, b: string) {
  return b.length - a.length
}

/**
 * Align a block of text, based on separator tokens.
 */
export function block (text: string, options?: Options): AlignmentResult {
  const { leftSeparators, rightSeparators, ignoreSeparators, spaceSeparators } = extend(DEFAULT_OPTIONS, options)

  const separators = leftSeparators.concat(rightSeparators).concat(ignoreSeparators).filter(isEmpty).sort(sortLength).map(escape)

  if (!separators.length) {
    return [text, []]
  }

  const separatorRegExp = new RegExp(
    '^(?:' + [
      '\\\\.',
      '"(?:\\\\.|[^"])*?"',
      '\'(?:\\\\.|[^\'])*?\'',
      '[^\'"]'
    ].join('|') + ')*?' +
    '(' + separators.join('|') + ')'
  )

  function alignText (text: string): AlignmentResult {
    const lines = text.split('\n')
    let matches = 0

    function findSeparator (line: string, startIndex: number = 0): [string, string, string] {
      const match = line.substr(startIndex).match(separatorRegExp)

      if (!match) {
        return
      }

      const [pre, separator] = match
      const { length } = pre

      // If the match is an ignore separator, move along the line.
      if (ignoreSeparators.indexOf(separator) > -1) {
        return findSeparator(line, length)
      }

      matches += 1

      return [
        line.substr(0, startIndex + length - separator.length).replace(/ +$/, ''),
        separator,
        line.substr(startIndex + length).replace(/^ +/, '')
      ]
    }

    // Split each line into the left context, separator and right content.
    const parts = lines.map(line => findSeparator(line))

    // Return early if there aren't enough matches to align.
    if (!matches) {
      return [text, []]
    }

    // Using recursion, align the parts to the right again.
    const rightParts = alignText(parts.map(part => part ? part[2] : '').join('\n'))

    // Get the text of the right parts.
    const rightLines = rightParts[0].split('\n')

    // Iterate over the parts and find the longest left length string.
    const leftLength = parts.reduce((prev, part) => {
      if (!part) {
        return prev
      }

      const [pre, separator] = part
      let length = pre.length + separator.length

      if (spaceSeparators.indexOf(separator) > -1) {
        length += 1
      }

      return length > prev ? length : prev
    }, 0)

    // An array of insertion positions.
    const positions: [number, number][] = []

    // Map the parts into their sanitized pieces with whitespace padding.
    const result = parts.map((part, index) => {
      if (!part) {
        return lines[index]
      }

      let [line, separator] = part
      let spaces = leftLength - line.length
      const position = 0

      if (spaceSeparators.indexOf(separator) > -1) {
        line += ' '
        spaces -= 1
      }

      const padding = repeat(' ', spaces - separator.length)

      if (leftSeparators.indexOf(separator) > -1) {
        positions.push([index, line.length])
        line += separator + padding
      } else {
        line += padding + separator
        positions.push([index, line.length - separator.length])
      }

      if (rightParts[1][index]) {
        positions.push([
          rightParts[1][index][0],
          rightParts[1][index][1] + line.length + 1
        ])
      }

      return line + ' ' + rightLines[index]
    }).join('\n')

    return [result, positions]
  }

  return alignText(text)
}

/**
 * Align text by a range of cursors.
 */
export function cursor (text: string, cursors: Cursor[]): AlignmentResult {

}