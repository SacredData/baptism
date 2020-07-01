const Batch = require('batch')
const debug = require('debug')('baptism:album')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { Pool } = require('nanoresource-pool')
const Track = require('./track')

class Album extends Pool {
  constructor(dir) {
    super(Track)
    this.duration = 0.0
    this.dir = path.resolve(dir)
    this.sources = fs.readdirSync(this.dir).map(p => `${this.dir}/${p}`)
      .filter(f => path.extname(f) === '.wav')

    let counter = 0
    for (const source of this.sources) {
      counter++
      debug('track counter', counter)
      this.add(new Track(source, { trackNumber: counter }))
    }
  }

  probe(callback) {
    const probes = {}
    const batch = new Batch().concurrency(2)
    for (const source of this.query()) {
      batch.push((next) => {
        source.stats((err, info) => {
          if (err) { return next(err) }
          probes[source.filename] = info
          source.silence((err) => {
            if (err) debug(err)
            source.soxi((err) => {
              if (err) debug(err)
              next(null)
            })
          })
        })
      })
    }

    batch.end((err) => {
      if (err) { return callback(err)  }

      // Sum duration of all tracks
      this.duration += Object.keys(probes).map(p => probes[p].duration)
        .reduce((a, b) => a + b)

      this.validate

      callback(null, probes)
    })
  }

  get validate() {
    const validations = {
      format: {
        bitDepth: this.query().every((tr, i, arr) => tr.format.bitDepth === arr[0].format.bitDepth),
        channels: this.query().every((tr, i, arr) => tr.format.channels === 2),
        sampleRate: this.query().every((tr, i, arr) => tr.format.sampleRate === arr[0].format.sampleRate)
      },
      silences: this.query().every(tr => tr.silences.start && tr.silences.end),
      stats: this.query().every(tr => tr.stats.peak.valid && tr.stats.rms.valid)
    }

    return this.ready = validations
  }
}

module.exports = Album
