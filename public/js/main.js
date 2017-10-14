(function () {
  var ws = {}

  var network = document.location.href
  var canvas = document.querySelector('canvas')
  var ctx = canvas.getContext('2d')
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  var r, g, b
  var lastRGB
  var RGBState = false
  var percentage = 0.0
  var percentage2 = 0.0
  var currentFreq = 380000000000000
  var colorNM
  var backgroundOn = false

  var SPEED_OF_LIGHT = 300000000
  var NM_IN_METER = 1000000000
  var lowestFreqHZ = 380000000000000
  var highestFreqHZ = 799000000000000

  var info = document.querySelector('#info')

  function calculate () {
    var wavelength = currentFreq

    // divide wave's speed by freq measured in hertz
    colorNM = Math.floor((SPEED_OF_LIGHT / wavelength) * NM_IN_METER)

    // Referenced from http://www.noah.org/wiki/Wavelength_to_RGB_in_Python
    // https://academo.org/demos/wavelength-to-colour-relationship/
    if (colorNM >= 380 && colorNM < 440) {
      r = -(colorNM - 440) / (440 - 380)
      g = 0.0
      b = 1.0
    } else if (colorNM >= 440 && colorNM < 490) {
      r = 0.0
      g = (colorNM - 440) / (490 - 440)
      b = 1.0
    } else if (colorNM >= 490 && colorNM < 510) {
      r = 0.0
      g = 1.0
      b = -(colorNM - 510) / (510 - 490)
    } else if (colorNM >= 510 && colorNM < 580) {
      r = (colorNM - 510) / (580 - 510)
      g = 1.0
      b = 0.0
    } else if (colorNM >= 580 && colorNM < 645) {
      r = 1.0
      g = -(colorNM - 645) / (645 - 580)
      b = 0.0
    } else if (colorNM >= 645 && colorNM < 771) {
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
  }

  function go2 () {
    var oscillator = audioCtx.createOscillator()
    var gainNode = audioCtx.createGain()
    var delayNode = audioCtx.createDelay()
    gainNode.connect(audioCtx.destination)
    gainNode.gain.value = 0.08
    delayNode.delayTime.value = 0.5
    delayNode.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 410 - (colorNM - 380) // value in hertz
    oscillator.connect(gainNode)
    console.log(oscillator.frequency.value, colorNM)
    oscillator.start()



    var oscillator3 = audioCtx.createOscillator()

    oscillator3.type = 'sine'
    oscillator.frequency.value = 410 - (colorNM - 470) // value in hertz
    oscillator3.connect(gainNode)
    oscillator3.start()

    setTimeout(function () {
      oscillator.stop()

      oscillator3.stop()
    }, 1000)
  }

  function go () {
    var oscillator = audioCtx.createOscillator()
    var gainNode = audioCtx.createGain()
    var delayNode = audioCtx.createDelay()
    gainNode.gain.value = 0.08
    delayNode.delayTime.value = 0.15
    delayNode.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 430 - (colorNM - 360) // value in hertz
    oscillator.connect(gainNode)
    oscillator.start()
    console.log('## ', oscillator.frequency.value, colorNM)
    var oscillator2 = audioCtx.createOscillator()

    oscillator2.type = 'triangle'
    oscillator.frequency.value = 430 - (colorNM - 310) // value in hertz
    oscillator2.connect(gainNode)
    oscillator2.start()

    var oscillator3 = audioCtx.createOscillator()

    oscillator3.type = 'sine'
    oscillator.frequency.value = 430 - (colorNM - 290) // value in hertz
    oscillator3.connect(gainNode)
    oscillator3.start()

    setTimeout(function () {
      oscillator.stop()
      oscillator2.stop()
      oscillator3.stop()
    }, 900)
  }

  function play () {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator()
    var gainNode = audioCtx.createGain()
    gainNode.connect(audioCtx.destination)
    gainNode.gain.value = 0.1

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

  function resize () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
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

  reconnect()
  resize()

  window.onresize = function () {
    resize()
  }

  function switchBackground () {
    backgroundOn = !backgroundOn

    if (backgroundOn) {
      document.body.className = 'on'
    } else {
      document.body.className = ''
    }
  }

  setInterval(function () {
    play()
    resize()
    switchBackground()
  }, 5000)

  window.onkeydown = function (e) {
    calculate()
    if (e.which === 38) {
      // up
      go2()
      currentFreq += 500000000000
      if (currentFreq > highestFreqHZ) {
        currentFreq = highestFreqHZ
      }
    } else if (e.which === 40) {
      // down
      go()
      currentFreq -= 500000000000
      if (currentFreq < lowestFreqHZ) {
        currentFreq = lowestFreqHZ
      }
    }

    info.textContent = currentFreq + ' hz'
  }

  window.requestAnimationFrame(generateGradient)
})()
