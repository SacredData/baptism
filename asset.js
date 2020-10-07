const debug = require('debug')('baptism:track')
const fs = require('fs')
const mime = require('mime')
const path = require('path')
const Resource = require('nanoresource')

class Asset extends Resource {
  constructor(source, opts = {}) {
    super()
    this.hint = ''
    this.filename = path.resolve(source)
    this.type = mime.getType(this.filename)
    this.fd = 0

    if (opts.hint) {
      this.hint = opts.hint
    }

    try {
      if (this.type.includes('image') || this.hint === 'image') {
        this.binary = Buffer.from(fs.readFileSync(this.filename))
          .toString('base64')
      }
    } catch (err) {
      console.error('Binary generation failed! This should not happen.')
      throw new Error(err)
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

class CoverArt extends Asset {
  constructor(source, opts={}) {
    super(source, Object.assign({ hint: 'image' }, opts))
  }
}

module.exports = { Asset, CoverArt }
