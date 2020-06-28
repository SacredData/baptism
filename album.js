const Batch = require('batch')
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
    this.sources = fs.readdirSync(this.dir).map(p => `${this.dir}/${p}`).filter(f => path.extname(f) === '.wav')
    for (const source of this.sources) {
      this.add(new Track(source))
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
            next(null)
          })
        })
      })
    }

    batch.end((err) => {
      if (err) { return callback(err)  }
      this.duration += Object.keys(probes).map(p => probes[p].duration).reduce(
        (a, b) => a + b
      )
      callback(null, probes)
    })
  }
}

module.exports = Album
