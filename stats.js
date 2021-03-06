const debug = require('debug')('baptism:stats')
const path = require('path')
const { spawn } = require('child_process')

function parseStats(st) {
  try {
    const stats = `${st}`.split('\n').map(stat => { return Number(stat.split(':')[1]) })
    const statsObj =  {
      duration: stats[1],
      peak: {
        db: 20 * Math.log10( stats[3] ),
        value: stats[3]
      },
      rms: {
        db: 20 * Math.log10( stats[8] ),
        value: stats[8]
      }
    }
    return statsObj
  } catch (err) {
    throw new Error(err)
  }
}

function main(file, cb) {
  let statsStr = ''
  const statsObj = {}
  const soxCmd = spawn('sox', [ path.resolve(file), '-n', 'stat' ])
  soxCmd.on('error', err => { cb(new Error(err)) })
  soxCmd.stderr.on('data', d => {
    statsStr += d
  })
  soxCmd.on('close', (code) => {
    debug('exitcode', code)
    Object.assign(statsObj, parseStats(statsStr))
    cb(null, statsObj)
  })
}

module.exports = main
