const debug = require('debug')('baptism:track')
const fs = require('fs')
const mime = require('mime')
const Resource = require('nanoresource')

class Asset extends Resource {
  constructor(source, opts = {}) {
    super()
    this.filename = source
    this.type = mime.getType(this.filename)
    this.fd = 0

    if (opts.hint) {
      this.hint = opts.hint
    }
  }

  _open (cb) {
    debug('Now opening file ...', this.filename)
    fs.open(this.filename, 'r', (err, fd) => {
      if (err) return cb(err)
      this.fd = fd
      cb(null)
    })
  }

  _close (cb) {
    debug('Now closing file ...')
    fs.close(this.fd, cb)
  }
}

module.exports = Asset
