'use strict'

// audio
var utils = require('./utils')

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
var audioCtx2 = new (window.AudioContext || window.webkitAudioContext)()

function generateAudio (opts) {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.gain.value = opts.gain
  gainNode.gain.linearRampToValueAtTime(0.0, 1500)
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
    gainNode.disconnect(audioCtx.destination)
    gainNode = null
  }, opts.timeout)
}

function up () {
  utils.currentFreq += 100000000000
  if (utils.currentFreq > utils.HIGHEST_FREQ_HZ) {
    utils.currentFreq = utils.HIGHEST_FREQ_HZ
  }

  generateAudio({
    gain: 0.01,
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
  if (utils.currentHorizontal > 0.999) {
    utils.currentHorizontal = 1.0
  }

  generateAudio({
    gain: 0.02,
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
    osc1: ['triangle', 200, 370],
    osc2: ['sine', 430, 400],
    osc3: ['triangle', 420, 360],
    timeout: 2200
  })
}

function play () {
  // create Oscillator node
  var oscillator = audioCtx2.createOscillator()
  var gainNode = audioCtx2.createGain()
  gainNode.connect(audioCtx2.destination)
  gainNode.gain.value = 0.3

  oscillator.type = 'sine'
  oscillator.frequency.value = 60 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx2.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 80 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  var oscillator3 = audioCtx2.createOscillator()

  oscillator3.type = 'sine'
  oscillator3.frequency.value = 80 // value in hertz
  oscillator3.connect(gainNode)
  oscillator3.start()

  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx2.currentTime + 0.80)

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
    gainNode.disconnect(audioCtx2.destination)
    gainNode = null
  }, 850)
}

function switchBlock () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.2

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
    gainNode.disconnect(audioCtx.destination)
    gainNode = null
  }, 1000)
}

function solveError () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.2

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
    gainNode.disconnect(audioCtx.destination)
    gainNode = null
  }, 300)
}

function solveCorrect () {
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.4

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
    gainNode.disconnect(audioCtx.destination)
    gainNode = null
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
    gainNode.disconnect(audioCtx.destination)
    gainNode = null
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
