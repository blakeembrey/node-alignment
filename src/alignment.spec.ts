import test = require('blue-tape')
import { blockAlign } from './alignment'

test('alignment', t => {
  t.test('blockAlign', t => {
    t.test('align block of code', t => {
      const result = blockAlign([
        'left=right',
        'another = more'
      ].join('\n'))

      t.equal(result[0], [
        'left    = right',
        'another = more'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 8], [1, 8]])

      t.end()
    })

    t.test('php style variables', t => {
      const result = blockAlign([
        '$a = 1;',
        '$bg = 2;'
      ].join('\n'))

      t.equal(result[0], [
        '$a  = 1;',
        '$bg = 2;'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 4], [1, 4]])

      t.end()
    })

    t.test('align text using colons', t => {
      const result = blockAlign([
        'left  : right',
        'another   :test',
        'something: else',
      ].join('\n'))

      t.equal(result[0], [
        'left:      right',
        'another:   test',
        'something: else'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 4], [1, 7], [2, 9]])

      t.end()
    })

    t.test('align text with colons and equals', t => {
      const result = blockAlign([
        'left  = right',
        'another   :test',
        'something: else'
      ].join('\n'))

      t.equal(result[0], [
        'left     = right',
        'another:   test',
        'something: else'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 9], [1, 7], [2, 9]])

      t.end()
    })

    t.test('ignore text in quotes', t => {
      const result = blockAlign([
        '"left:test"  = right',
        '"another ="  :test',
        'something: else'
      ].join('\n'))

      t.equal(result[0], [
        '"left:test" = right',
        '"another =":  test',
        'something:    else'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 12], [1, 11], [2, 9]])

      t.end()
    })

    t.test('align multiple signs', t => {
      const result = blockAlign([
        'this = that = test',
        'another = thing = here'
      ].join('\n'))

      t.equal(result[0], [
        'this    = that  = test',
        'another = thing = here'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 8], [0, 16], [1, 8], [1, 16]])

      t.end()
    })

    t.test('ignore escaped quotes', t => {
      const result = blockAlign([
        '"test\\" escape": more',
        '\'yet another \\\' escape\' = more'
      ].join('\n'))

      t.equal(result[0], [
        '"test\\" escape":          more',
        '\'yet another \\\' escape\' = more'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 15], [1, 24]])

      t.end()
    })

    t.test('align multiple separators', t => {
      const result = blockAlign([
        'test += 1',
        'something -= 1',
        'else /= 1'
      ].join('\n'))

      t.equal(result[0], [
        'test      += 1',
        'something -= 1',
        'else      /= 1'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 10], [1, 10], [2, 10]])

      t.end()
    })

    t.test('ignore lines with no separator', t => {
      const result = blockAlign([
        'something += 1',
        '# comment',
        'again = 5'
      ].join('\n'))

      t.equal(result[0], [
        'something += 1',
        '# comment',
        'again      = 5'
      ].join('\n'))

      t.deepEqual(result[1], [[0, 10], [2, 11]])

      t.end()
    })
  })

  t.test('ignore escaped opening quotes', t => {
    const result = blockAlign([
      'test\\"something=":else"',
      'something = simple'
    ].join('\n'))

    t.equal(result[0], [
      'test\\"something = ":else"',
      'something       = simple'
    ].join('\n'))

    t.deepEqual(result[1], [[0, 16], [1, 16]])

    t.end()
  })

  t.test('catch escaped esscape characters', t => {
    const result = blockAlign([
      '"test\\\\" :escape":more',
      '\'yet another \\\' escape\' = more'
    ].join('\n'))

    t.equal(result[0], [
      '"test\\\\":                 escape":more',
      '\'yet another \\\' escape\' = more'
    ].join('\n'))

    t.deepEqual(result[1], [[0, 8], [1, 24]])

    t.end()
  })

  t.test('ignore double colon', t => {
    const result = blockAlign([
      'App::NAME_KEY => \'text\',',
      'App::FORMAT_KEY => \'123\''
    ].join('\n'))

    t.equal(result[0], [
      'App::NAME_KEY   => \'text\',',
      'App::FORMAT_KEY => \'123\''
    ].join('\n'))

    t.deepEqual(result[1], [[0, 16], [1, 16]])

    t.end()
  })
})
