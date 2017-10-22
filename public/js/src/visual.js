'use strict'

var utils = require('./utils')
var matrices = require('./matrices')
var audio = require('./audio')

var RGBState = false

var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

var r, g, b
var lastRGB
var percentage = 0.0
var percentage2 = 0.0
var backgroundOn = false
var gameActive = false

var info = document.querySelector('#info')
var currentFace = document.querySelector('#face2')
var wrapper = document.querySelector('#wrapper')
var levelStatus = document.querySelector('#level')
var stats = document.querySelector('#stats h3 span')

var symbols = []
var currentSymbols = {}

levelStatus.querySelector('span').textContent = utils.getInfo('currentLevel', 1)

function calculate () {
  var wavelength = utils.currentFreq

  // horizontal movement
  var faces = document.querySelectorAll('.face')
  for (var i = 0; i < faces.length; i++) {
    faces[i].classList.add('off')
    wrapper.classList.remove('face' + (i + 1))
  }

  if (utils.currentHorizontal >= 0.75) {
    currentFace = document.querySelector('#face4')
    currentFace.classList.remove('off')
    wrapper.classList.add('face4')
  } else if (utils.currentHorizontal >= 0.5 && utils.currentHorizontal < 0.75) {
    currentFace = document.querySelector('#face3')
    wrapper.classList.add('face3')
    currentFace.classList.remove('off')
  } else if (utils.currentHorizontal >= 0.25 && utils.currentHorizontal < 0.5) {
    currentFace = document.querySelector('#face2')
    currentFace.classList.remove('off')
    wrapper.classList.add('face2')
  } else {
    currentFace = document.querySelector('#face1')
    currentFace.classList.remove('off')
    wrapper.className = ''
  }

  // divide wave's speed by freq measured in hertz
  utils.colorNM = Math.floor((utils.SPEED_OF_LIGHT / wavelength) * utils.NM_IN_METER)

  // Referenced from http://www.noah.org/wiki/Wavelength_to_RGB_in_Python
  // https://academo.org/demos/wavelength-to-colour-relationship/
  if (utils.colorNM >= 380 && utils.colorNM < 440) {
    r = -(utils.colorNM - 440) / (440 - 380)
    g = 0.0
    b = utils.currentBlue
  } else if (utils.colorNM >= 440 && utils.colorNM < 490) {
    r = 0.0
    g = (utils.colorNM - 440) / (490 - 440)
    b = utils.currentBlue
  } else if (utils.colorNM >= 490 && utils.colorNM < 510) {
    r = 0.0
    g = utils.currentGreen
    b = -(utils.colorNM - 510) / (510 - 490)
  } else if (utils.colorNM >= 510 && utils.colorNM < 580) {
    r = (utils.colorNM - 510) / (580 - 510)
    g = 1.0
    b = utils.currentBlue
  } else if (utils.colorNM >= 580 && utils.colorNM < 645) {
    r = 1.0
    g = -(utils.colorNM - 645) / (645 - 580)
    b = utils.currentBlue
  } else if (utils.colorNM >= 645 && utils.colorNM < 771) {
    r = 1.0
    g = 0.0
    b = 0.0
  } else {
    r = 0.0
    b = 0.0
    g = 0.0
  }

  r = Math.round(r * 100)
  g = Math.round(g * 100)
  b = Math.round(b * 100)

  RGBState = !RGBState

  if (RGBState) {
    lastRGB = 'rgba(' + r + ',' + g + ',' + b + ', 0.8)'
  }

  info.querySelector('#freq').textContent = utils.currentFreq
  info.querySelector('#mid').textContent = utils.currentHorizontal
}

function generateGradient () {
  percentage += 0.0009
  percentage2 += 0.015

  if (percentage > 0.5) {
    percentage = 0.0
    calculate()
  }

  if (percentage2 > 0.8) {
    percentage2 = 0.0
    calculate()
  }

  if (!lastRGB) {
    lastRGB = 'rgba(1, 1, 1, 0.9)'
  }

  if (!r && !g && !b) {
    r = 0
    g = 0
    b = 0
  }

  function randomize (high, low) {
    return Math.floor(Math.random() * (high - low + 1)) + low
  }

  var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(percentage, lastRGB)
  gradient.addColorStop(percentage2, 'rgba(' + r + ',' + g + ',' + b + ', ' + percentage + ')')
  ctx.globalAlpha = percentage
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.beginPath()
  ctx.moveTo(randomize(10, 570), randomize(20, 280))
  ctx.bezierCurveTo(randomize(20, 130), randomize(10, 200), randomize(10, 130), randomize(0, 150), 230, 150)
  ctx.bezierCurveTo(250, randomize(10, 180), randomize(10, 320), 180, randomize(300, 540), randomize(0, 150))
  ctx.bezierCurveTo(randomize(10, 420), 150, randomize(10, 420), 120, randomize(10, 420), 100)
  ctx.bezierCurveTo(randomize(0, 430), 40, randomize(10, 370), 30, randomize(50, 340), randomize(50, 400))
  ctx.bezierCurveTo(randomize(10, 320), randomize(0, 300), 250, 20, 250, 50)
  ctx.bezierCurveTo(randomize(10, 200), 5, randomize(0, 150), 20, 170, 80)
  ctx.closePath()
  ctx.lineWidth = 5

  if (utils.currentLevel == 1) {
    ctx.fillStyle = 'rgba(5, ' + randomize(0, 200) + ', ' + randomize(150, 240) + ', 0.2)'
  } else if (utils.currentLevel == 2) {
    ctx.fillStyle = 'rgba(' + randomize(150, 240) + ', ' + randomize(0, 200) + ', 5, 0.2)'
  } else if (utils.currentLevel == 3) {
    ctx.fillStyle = 'rgba(' + randomize(150, 240) + ', 5, ' + randomize(150, 240) + ', 0.2)'
  }

  ctx.fill()

  window.requestAnimationFrame(generateGradient)
}

function switchBackground () {
  backgroundOn = !backgroundOn

  if (backgroundOn) {
    currentFace.classList.add('on')
  } else {
    currentFace.classList.remove('on')
  }
}

function resize () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function add (data) {
  if (gameActive) {
    return
  }

  var first = data.first
  var second = data.second
  var coord = data.coord
  var secondSymbolsTotal = 0

  var puzzleNode = document.createElement('div')
  puzzleNode.id = 'puzzle'

  second.map(function (s) {
    secondSymbolsTotal += s.length
  })

  symbols = []

  data.all.map(function (p) {
    symbols.push(p)
  })

  var answerBox = document.createElement('div')
  answerBox.id = 'solution'
  var totalBoxes = secondSymbolsTotal * first.length * 2

  for (var i = 0; i < totalBoxes; i++) {
    currentSymbols['ans' + i] = 0
    var inputItem = document.createElement('div')
    inputItem.className = 'ansvalue'
    inputItem.id = 'ans-' + i

    inputItem.onclick = function (e) {
      var self = e.target
      var idx = self.id.split('-')[1]
      self.textContent = symbols[currentSymbols['ans' + idx]]

      currentSymbols['ans' + idx] += 1
      if (currentSymbols['ans' + idx] > Object.keys(symbols).length) {
        currentSymbols['ans' + idx] = 0
      }

      utils.saveInfo()

      audio.switchBlock()
    }
    answerBox.appendChild(inputItem)

    var j = i + 1

    if (j % first[0].length === 0 && (j < totalBoxes - 1)) {
      var plus = document.createElement('div')

      if (j % (first[0].length * second.length) === 0 && second.length > 1) {
        plus.className = 'plus'
        plus.textContent = ','
      } else {
        plus.className = 'plus'
        plus.textContent = '+'
      }
      answerBox.appendChild(plus)
    }
  }

  var submit = document.createElement('button')
  submit.type = 'button'
  submit.textContent = '✓'
  submit.onclick = function (e) {
    e.preventDefault()

    var ans = document.querySelectorAll('.ansvalue')
    var currentAnswer = ''

    for (var i = 0; i < ans.length; i++) {
      currentAnswer += ans[i].innerText
    }

    var answer = matrices.multiply(first, second)

    var validAnswer = (answer === currentAnswer)
    var validCoord = (utils.currentHorizontal == coord.horiz &&
                      utils.currentFreq == coord.freq)

    if (!validAnswer || !validCoord) {
      answerBox.classList.add('error')
      audio.solveError()
    } else {
      answerBox.classList.remove('error')
      audio.solveCorrect()
      document.body.removeChild(document.querySelector('#solution'))
      document.body.removeChild(document.querySelector('#puzzle'))

      utils.currentIteration += 1

      if (utils.currentIteration % 3 === 0) {
        utils.currentLevel += 1
        utils.currentIteration = 0
        levelStatus.querySelector('span').textContent = utils.currentLevel
      }

      if (utils.currentLevel > 5) {
        utils.currentLevel = 5
      }

      utils.triangles += utils.currentLevel * 10

      if (utils.triangles >= 999999) {
        utils.triangles = 999999
      }
      gameActive = false
      stats.textContent = utils.triangles
      utils.saveInfo()
    }
  }

  answerBox.appendChild(submit)

  var h2 = document.createElement('h2')
  var p1 = document.createElement('p')
  var p2 = document.createElement('p')

  h2.textContent = 'freq: ' + coord.freq + ' / horiz: ' + coord.horiz

  first.map(function (f) {
    var row = document.createElement('div')
    row.className = 'row'
    row.textContent = f.join('   ')
    p1.appendChild(row)
  })

  second.map(function (f) {
    var row = document.createElement('div')
    row.className = 'row'
    row.textContent = f.join('   ')
    p2.appendChild(row)
  })

  p1.style.width = (50 * first.length) + 'px'
  p2.style.width = (50 * second.length) + 'px'

  puzzleNode.appendChild(h2)
  puzzleNode.appendChild(p1)
  puzzleNode.appendChild(p2)
  document.body.appendChild(puzzleNode)
  document.body.appendChild(answerBox)
  gameActive = true
}

module.exports = {
  add: add,
  calculate: calculate,
  resize: resize,
  generateGradient: generateGradient,
  switchBackground: switchBackground
}
