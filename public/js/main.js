'use strict'

var audioMod = require('./src/audio')
var visualMod = require('./src/visual')
var matrices = require('./src/matrices')
var utils = require('./src/utils')

var shop = document.querySelector('#shop')
var canvas = document.querySelector('canvas')
var stats = document.querySelector('#stats h3 span')

visualMod.resize()
audioMod.play()

stats.textContent = utils.getInfo('triangles')

shop.onclick = function () {
  visualMod.add(matrices.generatePuzzle())
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

window.onkeyup = window.ontouchend = function (e) {
  utils.saveInfo()
}

function updateViz (pageX, pageY) {
  if (pageY <= 100) {
    // up
    audioMod.up()
  } else if (pageY >= 125) {
    // down
    audioMod.down()
  } else if (pageX <= 50) {
    // left
    audioMod.left()
  } else if (pageX >= 320) {
    // right
    audioMod.right()
  }
}

var touchFunc

canvas.ontouchstart = function (e) {
  e.preventDefault()

  if (e.touches) {
    touchFunc = setInterval(function () {
      updateViz(e.touches[0].pageX, e.touches[0].pageY)
    }, 10)
  } else {
    updateViz(e.pageX, e.pageY)
  }
}

canvas.ontouchend = function (e) {
  e.preventDefault()

  clearInterval(touchFunc)
}

window.requestAnimationFrame(visualMod.generateGradient)

