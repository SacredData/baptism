const path = require('path')
const { spawn } = require('child_process')

function parseStats(st) {
  console.log(`${st}`)
  const stats = `${st}`.split('\n').map(stat => { return Number(stat.split(':')[1]) })
  const statsObj =  {
    duration: stats[1],
    peak: {
      value: stats[3],
      valid: stats[3] <= 0.5 // 0.5 === -6dBFS
    },
    rms: {
      value: stats[8],
      valid: stats[8] <= 0.25 && stats[8] >= 0.06 // low: -22dB; high: -12dB
    }
  }
  console.log(statsObj)
  return statsObj
}

async function main() {
  const fp = path.resolve('./trim.wav')
  const soxCmd = spawn('sox', [ fp, '-n', 'stat' ])
  soxCmd.stderr.on('data', d => parseStats(d))
}

main()
