const fpcalc = require('fpcalc')
const path = require('path')

function main(inFile, cb) {
  // fpcalc(path.resolve(inFile), { raw: true }, function(err, result) {
  fpcalc(path.resolve(inFile), function(err, result) {
    if (err) { cb(err) }
    cb(null, result.fingerprint)
  })
}

module.exports = main
