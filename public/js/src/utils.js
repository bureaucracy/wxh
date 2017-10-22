'use strict'

var SPEED_OF_LIGHT = 300000000
var NM_IN_METER = 1000000000
var LOWEST_FREQ_HZ = 380000000000000
var HIGHEST_FREQ_HZ = 799000000000000
var MID_FREQ_HZ = (HIGHEST_FREQ_HZ + LOWEST_FREQ_HZ) / 2
var localstorage = window.localStorage

var utils = {
  SPEED_OF_LIGHT: SPEED_OF_LIGHT,
  NM_IN_METER: NM_IN_METER,
  LOWEST_FREQ_HZ: LOWEST_FREQ_HZ,
  HIGHEST_FREQ_HZ: HIGHEST_FREQ_HZ,
  MID_FREQ_HZ: MID_FREQ_HZ,
  currentFreq: getInfo('currentFreq', MID_FREQ_HZ),
  currentRed: getInfo('currentRed', 1.0),
  currentBlue: getInfo('currentBlue', 0.0),
  currentGreen: getInfo('currentGreen', 0.0),
  currentHorizontal: getInfo('currentHorizontal', 0.5),
  colorNM: getInfo('colorNM', 789),
  currentLevel: getInfo('currentLevel', 1),
  currentIteration: getInfo('currentIteration', 0),
  triangles: getInfo('triangles', 0),
  saveInfo: saveInfo,
  getInfo: getInfo
}

function saveInfo () {
  localstorage.setItem('currentFreq', utils.currentFreq)
  localstorage.setItem('currentRed', utils.currentRed)
  localstorage.setItem('currentBlue', utils.currentBlue)
  localstorage.setItem('currentGreen', utils.currentGreen)
  localstorage.setItem('currentHorizontal', utils.currentHorizontal)
  localstorage.setItem('currentIteration', utils.currentIteration)
  localstorage.setItem('triangles', utils.triangles)
  localstorage.setItem('currentLevel', utils.currentLevel)
}

function getInfo (key, deflt) {
  var item = localstorage.getItem(key)

  if (item) {
    return parseFloat(item)
  }

  return deflt
}

module.exports = utils
