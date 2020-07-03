const Album = require('./album')
const Asset = require('./asset')
const Master = require('./master')
const Release = require('./release')
const Track = require('./track')
const flags = require('./flags.json')
const soxi = require('./soxi')
const stats = require('./stats')
const spectrogram = require('./spectrogram')
const debug = require('debug')('baptism:index')

debug('Welcome to SACRED.AUDIO. This is SACRED1: Baptism.')

module.exports = {
  Album, Asset, Master, Release, Track, flags, soxi, stats, spectrogram
}
