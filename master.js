const Track = require('./track')

class Master extends Track {
  constructor(source, opts={}) {
    super(source, opts)

    this.parent = null

    if (opts.parent) {
      if (opts.parent instanceof Track) {
        this.parent = opts.parent
      } else {
        throw new Error(`Invalid opts.parent: must be an instance of bap.Track`)
      }
    }
  }

  compare (cb) {
    if (!this.parent) cb(new Error(`No parent, add one to the Master first.`))
  }
}

module.exports = Master
