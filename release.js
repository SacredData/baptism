const Album = require('./album')
const Track = require('./track')

class Release {
  constructor(opts={}) {
    this.tracks = []
    this.albums = []
    this.duration = 0.0

    if (opts.size) {
      switch (opts.size) {
        case 7:
        case 10:
        case 12:
          this.size = opts.size
          break
        default:
          throw new Error('Invalid size. Must be one of [7, 10, 12]')
          break
      }
    }

    if (opts.speed) {
      switch (opts.speed) {
        case 33:
        case 45:
          this.speed = opts.speed
          break
        default:
          throw new Error('Invalid speed. Must be one of [33, 45]')
          break
      }
    }
  }
  add(a) {
    if (a instanceof Album) {
      this.tracks.push(...a.query())
      this.albums.push(a)
      this.duration += a.duration
    } else if (a instanceof Track) {
      this.tracks.push(a)
      this.duration += a.duration
    }
  }
}

class CD extends Release {
  constructor(opts={}) {
    super(opts)
  }
}

class Digital extends Release {
  constructor(opts={}) {
    super(opts)
  }
}

class Vinyl extends Release {
  constructor(opts={}) {
    super(opts)
  }
}

module.exports = {
  CD, Digital, Release, Vinyl
}
