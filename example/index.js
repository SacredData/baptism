const bap = require('../index')

const newAlbum = new bap.Album('./')

newAlbum.probe((err, res) => {
  console.log(res)
  newAlbum.query()[0].spectrogram((err, spec) => {
    console.log(`Spectrogram output to: ${spec}`)
    newAlbum.query()[0].waveform((err, wave) => {
      console.log(`Waveform output to: ${wave}`)
    })
  })
})
