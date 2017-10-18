'use strict'

function generatePuzzle (level) {
  if (!level) {
    level = 1
  }

  let puzzle = {
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

module.exports = {
  generatePuzzle: generatePuzzle
}
