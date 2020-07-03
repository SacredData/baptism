const Album = require('./album')
const { Asset } = require('./asset')
const Track = require('./track')

class Release {
  constructor(opts={}) {
    this.tracks = []
    this.albums = []
    this.assets = []
    this.duration = 0.0
  }

  // Add an Album or Track to the Release
  add(a) {
    if (a instanceof Album) {
      this.tracks.push(...a.query())
      this.albums.push(a)
      this.duration += a.duration
    } else if (a instanceof Track) {
      this.tracks.push(a)
      this.duration += a.duration
    } else if (a instanceof Asset) {
      this.assets.push(a)
    } else {
      throw new Error('Must be an Album, Track, or Asset object')
    }

    if (this.minutesPerSide) {
      this.sides = Number((this.duration / (this.minutesPerSide * 60 * 2)).toFixed(0.1)) + 1
    }
  }
}

class CD extends Release {
  constructor(opts={}) {
    super(opts)
    /*
     * TODO @agrathwohl
     * Provide a CUE sheet file path as an option for the constructor
     */
  }
}

class Digital extends Release {
  constructor(opts={}) {
    super(opts)
  }
}

class Download extends Digital {
  constructor(opts={}) {
    super(opts)
  }
}

class Stream extends Digital {
  constructor(opts={}) {
    super(opts)
  }
}

class Vinyl extends Release {
  constructor(opts={}) {
    super(opts)
    this.size = null
    this.speed = null

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

    if (this.size && this.speed) {
      this.minutesPerSide = this.sideDurations.get(this.size)[
        this.speed === 45 ? 0 : 1
      ]
    }
  }

  get sideDurations() {
    return new Map([
      [7, [6]],
      [10, [12, 15]],
      [12, [15, 22]]
    ])
  }
}

module.exports = {
  CD, Digital, Download, Release, Stream, Vinyl
}
