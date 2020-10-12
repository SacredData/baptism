const debug = require('debug')('baptism:peaks')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

function scalePeaks(peaksData) {
  const maxVal = parseInt(Math.max(...[
    Math.max(...peaksData),
    Math.min(...peaksData)
  ].map(val => Math.abs(val))), 10)
  return peaksData.map(peak => peak / maxVal)
}

function main(audioFile, cb) {
  spawn('audiowaveform', [
    '-i',
    path.resolve(audioFile),
    '-b',
    '8',
    '-o',
    `${path.resolve(audioFile)}.json`,
    '--pixels-per-second',
    '20'
  ]).on('close', code => {
    debug(`audiowaveform command closed with exit code ${code}`)
    const scaledPeaks = scalePeaks(
      JSON.parse(
        fs.readFileSync(`${path.resolve(audioFile)}.json`)
      ).data
    )
    cb(null, scaledPeaks)
  })
}

module.exports = main
