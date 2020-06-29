const debug = require('debug')('baptism:stats')
const path = require('path')
const { spawn } = require('child_process')

function parseStats(st) {
  const stats = `${st}`.split('\n').map(stat => { return Number(stat.split(':')[1]) })
  const statsObj =  {
    duration: stats[1],
    peak: {
      db: 20 * Math.log10( stats[3] ),
      value: stats[3],
      valid: stats[3] <= 0.7 // -3dBFS
    },
    rms: {
      db: 20 * Math.log10( stats[8] ),
      value: stats[8],
      valid: stats[8] <= 0.25 && stats[8] >= 0.03 // low: -30dB; high: -12dB
    }
  }
  return statsObj
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
