const debug = require('debug')('baptism:track')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const getSpectrogram = require('./spectrogram')
const getStats = require('./stats')
const Resource = require('nanoresource')

class Track extends Resource {
  constructor(source) {
    super()
    this.filename = source
    this.fd = 0
    this.validations = {}
  }

  _open (cb) {
    console.log('Now opening file ...', this.filename)
    fs.open(this.filename, 'r', (err, fd) => {
      if (err) return cb(err)
      this.fd = fd
      cb(null)
    })
  }

  _close (cb) {
    console.log('Now closing file ...')
    fs.close(this.fd, cb)
  }

  silence (cb) {
    this.open((err) => {
      if (err) return cb(err)
      const silences = []

      function validateSilences(silObj) {
        const silenceStarts = Object.keys(silObj)
        return {
          start: Number(silenceStarts.shift()) === 0,
          end: Number(silenceStarts.pop()) > 0
        }
      }

      function parseSilences(sils) {
        const starts = []
        const maps = {}
        for (const s of sils) {
          if (s.includes('silence_start: ')) {
            starts.push(parseFloat(s.split('silence_start: ')[1]))
          } else if (s.includes('silence_duration: ')) {
            maps[starts.pop()] = s.split('silence_duration: ')[1]
          }
        }
        return [ maps, validateSilences(maps) ]
      }

      const ffmpegCmd = ffmpeg(this.filename)
        .audioFilters('silencedetect=n=-60dB:d=1')
        .format('null')
        .output('-')
        .on('stderr', d => {
          if (`${d}`.includes('silencedetect')) {
            silences.push(`${d}`)
          }
        })
        .on('error', err => { return this.inactive(cb, err) })
        .on('end', () => {
          debug('finished', silences)
          const parsedSilences = parseSilences(silences)
          this.silences = parsedSilences
          this.inactive(cb, null, parsedSilences)
        })

      ffmpegCmd.run()
    })
  }

  size (cb) {
    this.open((err) => {
      if (err) return cb(err)
      if (!this.active(cb)) return
      fs.fstat(this.fd, (err, st) => {
        if (err) return this.inactive(cb, err)
        this.inactive(cb, null, st.size)
      })
    })
  }

  spectrogram (cb) {
    this.open((err) => {
      if (err) return cb(err)
      if (!this.active(cb)) return
      getSpectrogram(this.filename, (err, sp) => {
        if (err) return cb(err)
        this.spectrogram = sp
        this.inactive(cb, null, sp)
      })
    })
  }

  stats (cb) {
    this.open((err) => {
      if (err) return cb(err)
      if (!this.active(cb)) return
      getStats(this.filename, (err, st) => {
        if (err) return cb(err)
        this.stats = st
        this.inactive(cb, null, st)
      })
    })
  }
}

module.exports = Track
