const Album = require('./album')
const Track = require('./track')

const flags = require('./flags.json')

const stats = require('./stats')
const spectrogram = require('./spectrogram')

module.exports = {
  Album, Track, flags, stats, spectrogram
}
