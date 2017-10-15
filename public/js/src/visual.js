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

function calculate () {
  var wavelength = utils.currentFreq

  // horizontal movement
  var faces = document.querySelectorAll('.face')
  for (var i = 0; i < faces.length; i++) {
    faces[i].classList.add('off')
  }
  if (utils.currentHorizontal >= 0.75) {
    currentFace = document.querySelector('#face4')
    currentFace.classList.remove('off')
  } else if (utils.currentHorizontal >= 0.5 && utils.currentHorizontal < 0.75) {
    currentFace = document.querySelector('#face3')
    currentFace.classList.remove('off')
  } else if (utils.currentHorizontal >= 0.25 && utils.currentHorizontal < 0.5) {
    currentFace = document.querySelector('#face2')
    currentFace.classList.remove('off')
  } else {
    currentFace = document.querySelector('#face1')
    currentFace.classList.remove('off')
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

  info.textContent = utils.currentFreq + ', ' + utils.currentHorizontal + ' hz'
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
}

module.exports = {
  calculate: calculate,
  resize: resize,
  generateGradient: generateGradient,
  switchBackground: switchBackground
}
