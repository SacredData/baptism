const fs = require('fs')
const getStats = require('./stats')
const Resource = require('nanoresource')

class Track extends Resource {
  constructor(source) {
    super()
    this.filename = source
    this.fd = 0
  }

  _open (cb) {
    console.log('Now opening file ...', this.filename)
    fs.open(this.filename, 'r', (err, fd) => {
      if (err) return cb(err)
      this.fd = fd
      cb(null)
    })
  }

  _close (cb) {
    console.log('Now closing file ...')
    fs.close(this.fd, cb)
  }

  stats (cb) {
    this.open((err) => {
      if (err) return cb(err)
      if (!this.active(cb)) return
      getStats(this.filename, (err, st) => {
        this.stats = st
        this.inactive(cb, null, st)
      })
    })
  }
}

/*
const t = new Track('./test1.wav')

t.stats((err, st) => {
    if (err) throw err
    console.log('stats:', st)
})
*/

module.exports = Track
