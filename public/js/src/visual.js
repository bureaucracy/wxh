'use strict'

var utils = require('./utils')
var math = require('./math')

var RGBState = false

var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

var r, g, b
var lastRGB
var percentage = 0.0
var percentage2 = 0.0
var backgroundOn = false

var info = document.querySelector('#info')
var currentFace = document.querySelector('#face2')
var wrapper = document.querySelector('#wrapper')

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
  var first = data.first
  var second = data.second
  var secondSymbolsTotal = 0

  second.map(function (s) {
    secondSymbolsTotal += s.length
  })

  symbols = []

  data.all.map(function (p) {
    symbols.push(p)
  })

  var answerBox = document.createElement('div')
  answerBox.className = 'solution'
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
      console.log(ans[i])
      currentAnswer += ans[i].innerText
    }

    var answer = math.multiply(first, second)
    console.log('........ ', answer, '--', currentAnswer)
    if (answer !== currentAnswer) {
      answerBox.classList.add('error')
    } else {
      answerBox.classList.remove('error')
    }
  }

  answerBox.appendChild(submit)

  var puzzleNode = document.createElement('div')
  puzzleNode.className = 'puzzle'
  var p1 = document.createElement('p')
  var p2 = document.createElement('p')

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

  puzzleNode.appendChild(p1)
  puzzleNode.appendChild(p2)
  document.body.appendChild(puzzleNode)
  document.body.appendChild(answerBox)
}

module.exports = {
  add: add,
  calculate: calculate,
  resize: resize,
  generateGradient: generateGradient,
  switchBackground: switchBackground
}
