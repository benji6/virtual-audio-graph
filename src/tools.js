import addIndex from 'ramda/src/addIndex'
import forEach from 'ramda/src/forEach'

export const asArray = x => Array.isArray(x) ? x : [x]
export const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1)
export const forEachIndexed = addIndex(forEach)
