'use strict'

var utils = require('./utils')

function generatePuzzle () {
  var puzzle = {
    all: ['⦿', '⊞', '⊛', '⊔', '⊿', '⋇', '⋈', '⌖', '☆']
  }

  var level = utils.currentLevel

  function generate () {
    var currIdx = Math.floor(Math.random() * (puzzle.all.length - 1 + 1)) + 1
    return puzzle.all[currIdx - 1]
  }

  function generateCoordinates () {
    var freq = Math.floor(Math.random() * (utils.HIGHEST_FREQ_HZ - utils.LOWEST_FREQ_HZ + 1)) + utils.LOWEST_FREQ_HZ
    freq = Math.trunc(freq / Math.pow(10, 11)) * Math.pow(10, 11)
    return {
      freq: freq,
      horiz: parseFloat(Math.random()).toFixed(3)
    }
  }

  switch (level) {
    case 1:
      puzzle.first = [[generate()]]
      puzzle.second = [[generate()]]
      puzzle.coord = generateCoordinates()
      break
    case 2:
      puzzle.first = [[generate(), generate()]]
      puzzle.second = [[generate(), generate()]]
      puzzle.coord = generateCoordinates()
      break
    case 3:
      puzzle.first = [[generate(), generate(), generate()]]
      puzzle.second = [[generate(), generate(), generate()], [generate(), generate(), generate()]]
      puzzle.coord = generateCoordinates()
      break
    case 4:
      puzzle.first = [[generate(), generate(), generate()], [generate(), generate(), generate()]]
      puzzle.second = [[generate(), generate(), generate()], [generate(), generate(), generate()], [generate(), generate(), generate()], [generate(), generate(), generate()]]
      puzzle.coord = generateCoordinates()
      break
    case 5:
      puzzle.first = [[generate(), generate(), generate(), generate()], [generate(), generate(), generate(), generate()], [generate(), generate(), generate(), generate()]]
      puzzle.second = [[generate(), generate(), generate(), generate()], [generate(), generate(), generate(), generate()], [generate(), generate(), generate(), generate()], [generate(), generate(), generate(), generate()]]
      puzzle.coord = generateCoordinates()
      break
    default:
      puzzle.first = [[generate()]]
      puzzle.second = [[generate()]]
      puzzle.coord = generateCoordinates()
  }

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
