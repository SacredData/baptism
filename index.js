const Album = require('./album')
const Track = require('./track')
const flags = require('./flags.json')
const soxi = require('./soxi')
const stats = require('./stats')
const spectrogram = require('./spectrogram')
const debug = require('debug')('baptism:index')

debug('Welcome to SACRED.AUDIO. This is SACRED1: Baptism.')

module.exports = {
  Album, Track, flags, soxi, stats, spectrogram
}
