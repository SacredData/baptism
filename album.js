const Batch = require('batch')
const debug = require('debug')('baptism:album')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { Master, Premaster } = require('./master')
const { Pool } = require('nanoresource-pool')
const Track = require('./track')

class Album extends Pool {
  constructor(dir, opts={}) {
    super(Track)
    this.metadata = {}
    this.duration = 0.0
    this.dir = path.resolve(dir)
    this.sources = fs.readdirSync(this.dir).map(p => `${this.dir}/${p}`)
      .filter(f => path.extname(f) === '.wav')
    this.infoTags = []

    if (opts.metadata) {
      if (opts.metadata.artist) {
        this.infoTags.push(['IART', opts.metadata.artist])
      }
      if (opts.metadata.comment) {
        this.infoTags.push(['ICMT'], opts.metadata.comment)
      }
      if (opts.metadata.title) {
        this.infoTags.push(['INAM', opts.metadata.title])
      }
      if (opts.metadata.album) {
        this.infoTags.push(['IPRD', opts.metadata.album])
      }
    }

    let counter = 0
    for (const source of this.sources) {
      counter++
      debug('track counter', counter)
      this.add(new Premaster(source, {
        trackNumber: counter,
        tags: this.infoTags
      }))
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
      silences: this.query().every(tr => tr.silences.start && tr.silences.end)
    }

    return this.ready = validations
  }
}

module.exports = Album
