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
    gain: 0.01,
    delay: 0.5,
    osc1: ['sawtooth', 410, 380],
    osc2: ['sine', 410, 460],
    osc3: ['sine', 480, 320],
    timeout: 1700
  })
}

function down () {
  utils.currentFreq -= 500000000000
  if (utils.currentFreq < utils.LOWEST_FREQ_HZ) {
    utils.currentFreq = utils.LOWEST_FREQ_HZ
  }

  generateAudio({
    gain: 0.01,
    delay: 0.15,
    osc1: ['sawtooth', 430, 360],
    osc2: ['triangle', 400, 390],
    osc3: ['sine', 480, 320],
    timeout: 1800
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
    gain: 0.01,
    delay: 0.35,
    osc1: ['sawtooth', 400, 410],
    osc2: ['sine', 430, 400],
    osc3: ['triangle', 440, 400],
    timeout: 1800
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
    gain: 0.01,
    delay: 0.75,
    osc1: ['sawtooth', 420, 390],
    osc2: ['sine', 410, 350],
    osc3: ['sawtooth', 400, 390],
    timeout: 1700
  })
}

function play () {
  // create Oscillator node
  var oscillator = audioCtx.createOscillator()
  var gainNode = audioCtx.createGain()
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.2
  var delayNode = audioCtx.createDelay()
  delayNode.delayTime.value = 0.5
  delayNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.value = 70 // value in hertz
  oscillator.connect(gainNode)
  oscillator.start()

  var oscillator2 = audioCtx.createOscillator()

  oscillator2.type = 'triangle'
  oscillator2.frequency.value = 80 // value in hertz
  oscillator2.connect(gainNode)
  oscillator2.start()

  var oscillator3 = audioCtx.createOscillator()

  oscillator3.type = 'sine'
  oscillator3.frequency.value = 90 // value in hertz
  oscillator3.connect(gainNode)
  oscillator3.start()

  setTimeout(function () {
    oscillator.stop()
    oscillator2.stop()
    oscillator3.stop()
  }, 140)
}

module.exports = {
  up: up,
  down: down,
  left: left,
  right: right,
  play: play
}
