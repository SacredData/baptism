const Album = require('./album')
const { Asset, CoverArt } = require('./asset')
const { Master, Premaster } = require('./master')
const { CD, Digital, Download, Release, Stream, Vinyl } = require('./release')
const Track = require('./track')
const fingerprint = require('./fingerprint')
const flags = require('./flags.json')
const peaks = require('./peaks')
const soxi = require('./soxi')
const stats = require('./stats')
const spectrogram = require('./spectrogram')
const debug = require('debug')('baptism:index')

debug('Welcome to SACRED.AUDIO. This is SACRED1: Baptism.')

module.exports = {
  Album, Asset, CD, CoverArt, Digital, Download, Master, Premaster, Release,
  Stream, Track, Vinyl, fingerprint, flags, peaks, soxi, stats, spectrogram
}
