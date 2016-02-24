# Alignment

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> **Alignment** does naive alignment of a block with variable assignments.

## Installation

```
npm install alignment --save
```

## Usage

Returns a tuple of the result text and cursor positions.

```js
import { block } from 'alignment'

const result = block(`
var x = 10;
var backgroundImage = 'http://example.com';
`)

console.log(result)
// [
//   '\nvar x               = 10;\nvar backgroundImage = \'http://example.com\';\n',
//   [ [ 1, 20 ], [ 2, 20 ] ]
// ]
```

**Caveats:**

* Currently only supports `\n` line endings
* True automatic alignment is difficult to achieve in a language agnostic way
  * Handling alignment across strings
  * Hanlding alignment across comments

## License

MIT

[npm-image]: https://img.shields.io/npm/v/alignment.svg?style=flat
[npm-url]: https://npmjs.org/package/alignment
[downloads-image]: https://img.shields.io/npm/dm/alignment.svg?style=flat
[downloads-url]: https://npmjs.org/package/alignment
[travis-image]: https://img.shields.io/travis/blakeembrey/node-alignment.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/node-alignment
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/node-alignment.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/node-alignment?branch=master
