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

window.ontouchstart = function (e) {
  if (e.touches[0].screenY <= (document.innerHeight / 3)) {
    // up
    audioMod.up()
  } else if (e.touches[0].screenY >= (document.innerHeight / 3) * 2) {
    // down
    audioMod.down()
  } else if (e.touches[0].screenX <= (document.innerWidth / 3)) {
    // left
    audioMod.left()
  } else if (e.touches[0].screenX >= (document.innerWidth / 3) * 2) {
    // right
    audioMod.right()
  }
}

window.requestAnimationFrame(visualMod.generateGradient)

