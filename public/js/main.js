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

document.querySelector('canvas').ontouchstart = function (e) {
  window.alert('got here! ', e.touches)
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

