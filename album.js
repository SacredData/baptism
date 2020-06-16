const fs = require('fs')
const path = require('path')
const Pool = require('nanoresource-pool')
const Track = require('./track')

class Album extends Pool {
  constructor(dir) {
    super(Track)
    this.dir = path.resolve(dir)
    this.sources = fs.readdirSync(this.dir).map(p => `${this.dir}/${p}`)
    for (const source of this.sources) {
      this.add(new Track(source))
    }
  }
}

module.exports = Album
