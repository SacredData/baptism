const Track = require('./track')

class Master extends Track {
  constructor(source, opts={}) {
    super(source, opts)

    if (opts.parent) {
      if (opts.parent instanceof Track) {
        this.parent = opts.parent
      }
    }
  }
}

module.exports = Master
