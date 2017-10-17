(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var audioMod = require('./src/audio')
var visualMod = require('./src/visual')
var ws = require('./src/ws')

ws.reconnect()
visualMod.resize()

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

window.requestAnimationFrame(visualMod.generateGradient)


},{"./src/audio":2,"./src/visual":4,"./src/ws":5}],2:[function(require,module,exports){
'use strict'

// audio
var utils = require('./utils')

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function generateAudio (opts) {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  var delayNode = audioCtx.createDelay()
  gainNode.gain.value = opts.gain
  delayNode.delayTime.value = opts.delay
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  oscillator.type = opts.osc1[0]
  oscillator.frequency.value = opts.osc1[1] - (utils.colorNM - opts.osc1[2]) // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()
  console.log('## ', oscillator.frequency.value, utils.colorNM)
  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = opts.osc2[0]
  oscillator2.frequency.value = opts.osc2[1] - (utils.colorNM - opts.osc2[2]) // value in hertz
  oscillator2.connect(gainNode)
  console.log('##2 ', oscillator2.frequency.value, utils.colorNM)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = opts.osc3[0]
  oscillator3.frequency.value = opts.osc3[1] - (utils.colorNM - opts.osc3[2]) // value in hertz
  oscillator3.connect(gainNode)
  console.log('##3 ', oscillator3.frequency.value, utils.colorNM)
  oscillator3.start()

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, opts.timeout)
}

function up () {
  utils.currentFreq += 500000000000
  if (utils.currentFreq > utils.HIGHEST_FREQ_HZ) {
    utils.currentFreq = utils.HIGHEST_FREQ_HZ
  }

  generateAudio({
    gain: 0.05,
    delay: 0.5,
    osc1: ['sawtooth', 410, 380],
    osc2: ['sine', 410, 460],
    osc3: ['sine', 480, 320],
    timeout: 700
  })
}

function down () {
  utils.currentFreq -= 500000000000
  if (utils.currentFreq < utils.LOWEST_FREQ_HZ) {
    utils.currentFreq = utils.LOWEST_FREQ_HZ
  }

  generateAudio({
    gain: 0.05,
    delay: 0.15,
    osc1: ['sawtooth', 430, 360],
    osc2: ['triangle', 400, 390],
    osc3: ['sine', 480, 320],
    timeout: 800
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
    gain: 0.05,
    delay: 0.35,
    osc1: ['sawtooth', 400, 410],
    osc2: ['sine', 430, 400],
    osc3: ['triangle', 440, 400],
    timeout: 800
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
    gain: 0.05,
    delay: 0.75,
    osc1: ['sawtooth', 420, 390],
    osc2: ['sine', 410, 350],
    osc3: ['sawtooth', 400, 390],
    timeout: 700
  })
}

function play () {
  // create Oscillator node
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.3

  oscillator.type = 'sine'
  oscillator.frequency.value = 120 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 100 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = 'sine'
  oscillator3.frequency.value = 110 // value in hertz
  oscillator3.connect(gainNode)
  oscillator3.start()

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, 120)
}

module.exports = {
  up: up,
  down: down,
  left: left,
  right: right,
  play: play
}

},{"./utils":3}],3:[function(require,module,exports){
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
  colorNM: 789
}

},{}],4:[function(require,module,exports){
'use strict'

var utils = require('./utils')

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

module.exports = {
  calculate: calculate,
  resize: resize,
  generateGradient: generateGradient,
  switchBackground: switchBackground
}

},{"./utils":3}],5:[function(require,module,exports){
'use strict'

var ws = {}

var network = document.location.href

function reconnect () {
  function connect () {
    try {
      console.log('reconnecting ', network)
      var host = network.split('://')
      var protocol = host[0]

      ws[host[1]] = new window.WebSocket('ws' + (protocol === 'https' ? 's' : '') + '://' + host[1])
      ws[host[1]].onerror = function () {
        console.log('could not connect to ', host[1])
        ws[host[1]].close()
      }

      ws[host[1]].onopen = function () {
        ws[host[1]].send(JSON.stringify({
          type: 'card.feed'
        }))

        ws[host[1]].onmessage = function (data) {
          console.log('incoming ', data)
          data = JSON.parse(data.data)
        }
      }

      ws[host[1]].onclose = function () {
        console.log('reconnecting to', network)
        setTimeout(function () {
          connect(network)
        }, 1500)
      }
    } catch (err) {
      console.log(err)
    }
  }
  connect()
}

module.exports = {
  reconnect: reconnect
}

},{}]},{},[1]);
