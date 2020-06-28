const debug = require('debug')('baptism:spectrogram')
const path = require('path')
const { spawn } = require('child_process')
const spectrogramFlags = require('./flags.json').spectrogram.flags

function main(file, cb) {
  const uri = path.resolve(file)
  const outFile = `${uri}.png`
  const soxCmd = spawn('sox', [
    uri,
    '-n',
    'spectrogram',
    ...spectrogramFlags,
    '-o',
    outFile
  ])
  soxCmd.on('error', err => { cb(new Error(err)) })
  soxCmd.on('close', (code) => {
    debug('exitcode', code)
    cb(null, outFile)
  })
}

module.exports = main
