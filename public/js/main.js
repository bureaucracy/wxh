'use strict'

var audioMod = require('./src/audio')
var visualMod = require('./src/visual')
var ws = require('./src/ws')
var math = require('./src/math')

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

visualMod.add(math.generatePuzzle())

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

