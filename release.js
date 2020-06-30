const Album = require('./album')

class Release {
  constructor(opts={}) {
    this.tracks = []
    this.albums = []

    if (opts.size) {
      this.size = opts.size
    }

    if (opts.speed) {
      this.speed = opts.speed
    }
  }
  add(a) {
    if (a instanceof Album) {
      this.tracks.push(...a.query())
      this.albums.push(a)
    } else if (a instanceof Track) {
      this.tracks.push(a)
    }
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

class CD extends Release {
  constructor(opts={}) {
    super()
  }
}

module.exports = {
  CD, Digital, Release, Vinyl
}