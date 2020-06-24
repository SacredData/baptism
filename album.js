const fs = require('fs')
const path = require('path')
const Pool = require('nanoresource-pool')
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
      this.add(newTrack)
    }
  }
}

module.exports = Album
