const debug = require('debug')('baptism:soxi')
const path = require('path')
const spawn = require('child_process').spawn

function parseSoxi(soxiStr) {
  try {
    const soxiStats = soxiStr.split('\n').filter(f => f !== '').map(m => m.split(': ')[1])
    return {
      channels: Number(soxiStats[1]),
      sampleRate: Number(soxiStats[2]),
      bitDepth: Number(soxiStats[3].split('-bit')[0])
    }
  } catch (err) {
    console.error('Could not parse soxi output. How did that happen???')
    throw new Error(err)
  }
}

function main(file, cb) {
  let soxiStr = ''
  const soxiCmd = spawn('soxi', [path.resolve(file)])
  soxiCmd.on('error', err => { cb(err) })
  soxiCmd.stdout.on('data', d => {
    soxiStr += d
  })
  soxiCmd.on('close', code => {
    debug('exitcode', code)
    cb(null, parseSoxi(`${soxiStr}`))
  })
}

module.exports = main
