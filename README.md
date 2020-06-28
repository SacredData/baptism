# SACRED1: Baptism
> Analyze and accept audio submissions conditionally and programmatically.

Baptism is the first stage in the SACRED AUDIO automated workflow. It
objectifies WAV files and provides interfaces to `ffmpeg` and `sox` to produce
industry-compliant analyses of the audio data.

## Status
> In Development

## Installation

```sh
$ npm -i baptism
```

## Example

```js
const bap = require('../index')

const newAlbum = new bap.Album('./')

newAlbum.probe((err, res) => {
  console.log(res)
  
})
```

```
{
  '/home/agrathwohl/code/sacreddata/baptism/example/example.wav': {
    duration: 10,
    peak: { db: -0.018041945998171376, value: 0.997925, valid: false },
    rms: { db: -15.695817254036564, value: 0.164138, valid: true }
  }
}
```

## API
> WIP

### `const bap = require('baptism')`

Import `baptism`.

### `album = new bap.Album(dir)`

An object, which provides one or more `Track` objects. Extends
[nanoresource-pool](https://github.com/little-core-labs/nanoresource-pool).

#### `album.probe(callback)`

Batch processes each `Track` in the `Album`, calling the `Track` object's
`track.stats()` method. Callback provides an object containing each `Track`
object's probe results.

### `bap.stats(filename, callback)`

Returns an object containing dynamics analysis measurements provided by the 
[SoX](http://sox.sourceforge.net/) application.

### `bap.spectrogram(filename, callback)`

Returns a file path to a PNG of the file's spectrogram.

### `track = new bap.Track(filename)`

An object, which represents a single audio file. Extends
[nanoresource](https://github.com/little-core-labs/nanoresource).

#### `track.spectrogram(callback)`

Calls `bap.spectrogram()` on the `Track` object. `track.spectrogram` becomes the
file path to the PNG file returned by the `bap.spectrogram()` method.

#### `track.stats(callback)`

Calls `bap.stats()` on the `Track` object. `track.stats` becomes the data
object returned by the `bap.stats()` method.
