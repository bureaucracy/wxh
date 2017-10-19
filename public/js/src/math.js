'use strict'

function generatePuzzle (level) {
  if (!level) {
    level = 1
  }

  var puzzle = {
    first: [['⦿', '⊞', '⊛']],
    second: [['⊔', '⊿', '⋇'], ['⋈', '⌖', '☆']],
    all: ['⦿', '⊞', '⊛', '⊔', '⊿', '⋇', '⋈', '⌖', '☆']
  }
  /*
  switch (level) {
    case 1:
    default:

  }
  */
  return puzzle
}

function multiply (first, second) {
  if ((!first || !first.length) || (!second || !second.length)) {
    console.error('Missing matrices.')
    return
  }

  if (first[0].length !== second[0].length) {
    console.error('First matrix length does not match second matrix column length')
    return
  }

  let newMatrix = []
  let subMatrix = []

  first.map((f) => {
    second.map((s) => {
      for (let i = 0; i < s.length; i++) {
        subMatrix.push(f[i] + s[i])
      }

      newMatrix.push(subMatrix.join(''))
      subMatrix = []
    })
  })
  console.log('new matrix', newMatrix.join(''))
  return newMatrix.join('')
}

module.exports = {
  generatePuzzle: generatePuzzle,
  multiply: multiply
}
