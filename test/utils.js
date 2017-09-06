const test = require('tape')
const equals = require('@std/esm')(module)('../src/utils').equals

const a = []
const b = a
const listA = [1, 2, 3]
const listB = [1, 3, 2]

test('equals - tests for deep equality of its operands', t => {
  t.deepEqual(equals(100, 100), true)
  t.deepEqual(equals(100, '100'), false)
  t.deepEqual(equals([], []), true)
  t.deepEqual(equals(a, b), true)
  t.end()
})

test('equals - considers equal Boolean primitives equal', t => {
  t.deepEqual(equals(true, true), true)
  t.deepEqual(equals(false, false), true)
  t.deepEqual(equals(true, false), false)
  t.deepEqual(equals(false, true), false)
  t.end()
})

test('equals - considers equal number primitives equal', t => {
  t.deepEqual(equals(0, 0), true)
  t.deepEqual(equals(0, 1), false)
  t.deepEqual(equals(1, 0), false)
  t.end()
})

test('equals - considers equal string primitives equal', t => {
  t.deepEqual(equals('', ''), true)
  t.deepEqual(equals('', 'x'), false)
  t.deepEqual(equals('x', ''), false)
  t.deepEqual(equals('foo', 'foo'), true)
  t.deepEqual(equals('foo', 'bar'), false)
  t.deepEqual(equals('bar', 'foo'), false)
  t.end()
})

test('equals - handles objects', t => {
  t.deepEqual(equals({}, {}), true)
  t.deepEqual(equals({a: 1, b: 2}, {a: 1, b: 2}), true)
  t.deepEqual(equals({a: 2, b: 3}, {a: 2, b: 3}), true)
  t.deepEqual(equals({a: 2, b: 3}, {a: 3, b: 3}), false)
  t.deepEqual(equals({a: 2, b: 3, c: 1}, {a: 2, b: 3}), false)
  t.end()
})

test('equals - handles lists', t => {
  t.deepEqual(equals([], {}), false)
  t.deepEqual(equals(listA, listB), false)
  t.end()
})

const typArr1 = new ArrayBuffer(10)
typArr1[0] = 1
const typArr2 = new ArrayBuffer(10)
typArr2[0] = 1
const typArr3 = new ArrayBuffer(10)
const intTypArr = new Int8Array(typArr1)
typArr3[0] = 0
test('equals - handles typed arrays', t => {
  t.deepEqual(equals(typArr1, typArr2), true)
  t.deepEqual(equals(typArr1, typArr3), false)
  t.deepEqual(equals(typArr1, intTypArr), false)
  t.end()
})
