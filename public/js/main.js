'use strict'

var audioMod = require('./src/audio')
var visualMod = require('./src/visual')
var math = require('./src/math')

var shop = document.querySelector('#shop')
var canvas = document.querySelector('canvas')
var debug = document.querySelector('#debug')

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

canvas.ontouchmove = function (e) {
  e.preventDefault()

  var pageX = 0
  var pageY = 0

  if (e.touches) {
    for (var i = 0; i < e.touches.length; i++) {
      debug.textContent = e.touches[i].pageX + ', ' + e.touches[i].pageY
      pageX = e.touches[i].pageX
      pageY = e.touches[i].pageY
      updateViz(pageX, pageY)
    }
  } else {
    pageX = e.pageX
    pageY = e.pageY
    updateViz(pageX, pageY)
  }
}

window.requestAnimationFrame(visualMod.generateGradient)

