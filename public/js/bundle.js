(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var audioMod = require('./src/audio')
var visualMod = require('./src/visual')
var math = require('./src/math')

var shop = document.querySelector('#shop')

visualMod.resize()

shop.onclick = function () {
  visualMod.add(math.generatePuzzle())
  audioMod.startGame()
}

window.onresize = function () {
  visualMod.resize()
}

setInterval(function () {
  audioMod.play()
  visualMod.resize()
  visualMod.switchBackground()
}, 5000)

window.onkeydown = function (e) {
  if (e.which === 38) {
    // up
    audioMod.up()
  } else if (e.which === 40) {
    // down
    audioMod.down()
  } else if (e.which === 37) {
    // left
    audioMod.left()
  } else if (e.which === 39) {
    // right
    audioMod.right()
  }

  visualMod.calculate()
}

function updateViz (pageX, pageY) {
  if (pageY <= (document.innerHeight / 3)) {
    // up
    audioMod.up()
  } else if (pageY >= (document.innerHeight / 3) * 2) {
    // down
    audioMod.down()
  } else if (pageX <= (document.innerWidth / 3)) {
    // left
    audioMod.left()
  } else if (pageX >= (document.innerWidth / 3) * 2) {
    // right
    audioMod.right()
  }
}

window.ontouchstart = function (e) {
  alert('got here! ', e.touches)
  e.preventDefault()

  var pageX = 0
  var pageY = 0

  if (e.touches) {
    for (var i = 0; i < e.touches.length; i++) {
      pageX = e.touches[i].pageX
      pageY = e.touches[i].pageY
      updateViz(pageX, pageY)
    }
  } else {
    pageX = e.clientX
    pageY = e.clientY
    updateViz(pageX, pageY)
  }
}

window.requestAnimationFrame(visualMod.generateGradient)


},{"./src/audio":2,"./src/math":3,"./src/visual":5}],2:[function(require,module,exports){
'use strict'

// audio
var utils = require('./utils')

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function generateAudio (opts) {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  var delayNode = audioCtx.createDelay()
  gainNode.gain.value = opts.gain
  gainNode.gain.linearRampToValueAtTime(0.0, 1500)
  delayNode.delayTime.value = opts.delay
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  oscillator.type = opts.osc1[0]
  oscillator.frequency.value = opts.osc1[1] - (utils.colorNM - opts.osc1[2]) // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()
  // console.log('## ', oscillator.frequency.value, utils.colorNM)
  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = opts.osc2[0]
  oscillator2.frequency.value = opts.osc2[1] - (utils.colorNM - opts.osc2[2]) // value in hertz
  oscillator2.connect(gainNode)
  // console.log('##2 ', oscillator2.frequency.value, utils.colorNM)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = opts.osc3[0]
  oscillator3.frequency.value = opts.osc3[1] - (utils.colorNM - opts.osc3[2]) // value in hertz
  oscillator3.connect(gainNode)
  // console.log('##3 ', oscillator3.frequency.value, utils.colorNM)
  oscillator3.start()

  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2)

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, opts.timeout)
}

function up () {
  utils.currentFreq += 100000000000
  if (utils.currentFreq > utils.HIGHEST_FREQ_HZ) {
    utils.currentFreq = utils.HIGHEST_FREQ_HZ
  }

  generateAudio({
    gain: 0.01,
    delay: 0.5,
    osc1: ['sine', 380, 310],
    osc2: ['sine', 410, 390],
    osc3: ['sawtooth', 430, 410],
    timeout: 1700
  })
}

function down () {
  utils.currentFreq -= 100000000000
  if (utils.currentFreq < utils.LOWEST_FREQ_HZ) {
    utils.currentFreq = utils.LOWEST_FREQ_HZ
  }

  generateAudio({
    gain: 0.01,
    delay: 0.15,
    osc1: ['sine', 400, 310],
    osc2: ['sine', 430, 400],
    osc3: ['sawtooth', 430, 410],
    timeout: 2200
  })
}

function left () {
  utils.currentHorizontal += 0.001
  utils.currentHorizontal = parseFloat(utils.currentHorizontal.toFixed(3))
  utils.currentBlue += 0.002
  utils.currentGreen += 0.005
  utils.currentRead += 0.008
  if (utils.currentBlue > 0.9) {
    utils.currentBlue = 1.0
  }
  if (utils.currentGreen > 0.9) {
    utils.currentGreen = 1.0
  }
  if (utils.currentRed > 0.9) {
    utils.currentRed = 1.0
  }
  if (utils.currentHorizontal > 0.9) {
    utils.currentHorizontal = 1.0
  }

  generateAudio({
    gain: 0.02,
    delay: 0.35,
    osc1: ['triangle', 200, 410],
    osc2: ['sine', 430, 400],
    osc3: ['triangle', 420, 400],
    timeout: 2200
  })
}

function right () {
  utils.currentHorizontal -= 0.001
  utils.currentHorizontal = parseFloat(utils.currentHorizontal.toFixed(3))
  utils.currentBlue -= 0.005
  utils.currentGreen -= 0.002
  utils.currentRed -= 0.008
  if (utils.currentBlue < 0) {
    utils.currentBlue = 0
  }
  if (utils.currentGreen < 0) {
    utils.currentGreen = 0.0
  }
  if (utils.currentRed < 0) {
    utils.currentRed = 0.0
  }
  if (utils.currentHorizontal < 0) {
    utils.currentHorizontal = 0.0
  }

  generateAudio({
    gain: 0.02,
    delay: 0.75,
    osc1: ['triangle', 200, 370],
    osc2: ['sine', 430, 400],
    osc3: ['triangle', 420, 360],
    timeout: 2200
  })
}

function play () {
  // create Oscillator node
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.3
  var delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.5
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.value = 60 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 80 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = 'sine'
  oscillator3.frequency.value = 80 // value in hertz
  oscillator3.connect(gainNode)
  oscillator3.start()

  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.80)

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, 850)
}

function switchBlock () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.2
  var delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.5
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.value = 180 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 180 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1)

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
  }, 1000)
}

function solveError () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.2
  var delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.5
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sawtooth'
  oscillator.frequency.value = 100 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 120 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
  }, 300)
}

function solveCorrect () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.4
  var delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.2
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.value = 195 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 110 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = 'triangle'
  oscillator3.frequency.value = 80 // value in hertz
  oscillator3.connect(gainNode)
  oscillator3.start()

  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2)

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, 2500)
}

function startGame () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.3
  var delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.2
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.value = 215 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 120 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = 'sawtooth'
  oscillator3.frequency.value = 20 // value in hertz
  oscillator3.connect(gainNode)
  oscillator3.start()

  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2)

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, 2500)
}

module.exports = {
  up: up,
  down: down,
  left: left,
  right: right,
  play: play,
  switchBlock: switchBlock,
  solveError: solveError,
  solveCorrect: solveCorrect,
  startGame: startGame
}

},{"./utils":4}],3:[function(require,module,exports){
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

  var newMatrix = []
  var subMatrix = []

  first.map(function (f) {
    second.map(function (s) {
      for (var i = 0; i < s.length; i++) {
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

},{"./utils":4}],4:[function(require,module,exports){
'use strict'

var SPEED_OF_LIGHT = 300000000
var NM_IN_METER = 1000000000
var LOWEST_FREQ_HZ = 380000000000000
var HIGHEST_FREQ_HZ = 799000000000000

module.exports = {
  SPEED_OF_LIGHT: SPEED_OF_LIGHT,
  NM_IN_METER: NM_IN_METER,
  LOWEST_FREQ_HZ: LOWEST_FREQ_HZ,
  HIGHEST_FREQ_HZ: HIGHEST_FREQ_HZ,
  currentFreq: 380000000000000,
  currentRed: 1.0,
  currentBlue: 0.0,
  currentGreen: 0.0,
  currentHorizontal: 0.5,
  colorNM: 789,
  currentLevel: 1,
  currentIteration: 0
}

},{}],5:[function(require,module,exports){
'use strict'

var utils = require('./utils')
var math = require('./math')
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

var symbols = []
var currentSymbols = {}

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

  var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(percentage, lastRGB)
  gradient.addColorStop(percentage2, 'rgba(' + r + ',' + g + ',' + b + ', ' + percentage + ')')
  ctx.globalAlpha = percentage
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

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

      audio.switchBlock()
    }
    answerBox.appendChild(inputItem)

    if ((i + 1) % 2 === 0 && (i < totalBoxes - 1)) {
      var plus = document.createElement('div')
      plus.className = 'plus'
      plus.textContent = '+'
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

    var answer = math.multiply(first, second)

    var validAnswer = (answer === currentAnswer)
    var validCoord = (utils.currentHorizontal == coord.horiz && utils.currentFreq == coord.freq)

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
      gameActive = false
    }
  }

  answerBox.appendChild(submit)

  var h2 = document.createElement('h2')
  var p1 = document.createElement('p')
  var p2 = document.createElement('p')

  h2.textContent = coord.freq + ' / ' + coord.horiz

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

},{"./audio":2,"./math":3,"./utils":4}]},{},[1]);
