const bap = require('../index')

const newAlbum = new bap.Album('../test/submission1')

newAlbum.probe((err, res) => {
  console.log(res)
})
