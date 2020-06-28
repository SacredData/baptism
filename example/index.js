const bap = require('../index')

const newAlbum = new bap.Album('./')

newAlbum.probe((err, res) => {
  console.log(res)
})
