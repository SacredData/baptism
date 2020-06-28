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
    for (const source of this.sources) {
      const newTrack = new Track(source)
      newTrack.stats()
      newTrack.silence()
      this.add(newTrack)
    }
  }
  validate() {
    return {
      dynamics: this.query().every(st => st.stats.peak.valid && st.stats.rms.valid),
      silences: this.query().every(st => st.silences[1].start && st.silences[1].end)
    }
  }
}

module.exports = Album
