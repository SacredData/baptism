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

const newAlbum = new bap.Album('../test/submission1')

newAlbum.probe((err, res) => {
  console.log(res)
})
```

```
Now opening file ... /home/gwohl/code/sacreddata/baptism/test/submission1/A1 Radiate (Premaster).wav
Now opening file ... /home/gwohl/code/sacreddata/baptism/test/submission1/A2 Desire (ft. Julien Mier) (Premaster).wav
Now opening file ... /home/gwohl/code/sacreddata/baptism/test/submission1/A3 Unkempt (Premaster).wav
Now opening file ... /home/gwohl/code/sacreddata/baptism/test/submission1/A4 Hole (Premaster).wav
Now opening file ... /home/gwohl/code/sacreddata/baptism/test/submission1/B1 Bliss (Premaster).wav
Now opening file ... /home/gwohl/code/sacreddata/baptism/test/submission1/B2 Cracks In Surface:Ending (Premaster).wav
{
  '/home/gwohl/code/sacreddata/baptism/test/submission1/A2 Desire (ft. Julien Mier) (Premaster).wav': {
    duration: 193.685601,
    peak: { db: -3.2491150190217786, value: 0.68793, valid: true },
    rms: { db: -22.698157506035233, value: 0.073298, valid: true }
  },
  '/home/gwohl/code/sacreddata/baptism/test/submission1/A1 Radiate (Premaster).wav': {
    duration: 260.650952,
    peak: { db: -7.153005031009871, value: 0.438884, valid: true },
    rms: { db: -22.68903771488658, value: 0.073375, valid: true }
  },
  '/home/gwohl/code/sacreddata/baptism/test/submission1/A3 Unkempt (Premaster).wav': {
    duration: 239.987256,
    peak: { db: -6.991731759830255, value: 0.447109, valid: true },
    rms: { db: -25.245654059568572, value: 0.054666, valid: true }
  },
  '/home/gwohl/code/sacreddata/baptism/test/submission1/A4 Hole (Premaster).wav': {
    duration: 231.955601,
    peak: { db: -3.8525200383252822, value: 0.641762, valid: true },
    rms: { db: -22.007638475641002, value: 0.079363, valid: true }
  },
  '/home/gwohl/code/sacreddata/baptism/test/submission1/B1 Bliss (Premaster).wav': {
    duration: 226.599932,
    peak: { db: -2.46313158616264, value: 0.753084, valid: false },
    rms: { db: -19.894930780329997, value: 0.101217, valid: true }
  },
  '/home/gwohl/code/sacreddata/baptism/test/submission1/B2 Cracks In Surface:Ending (Premaster).wav': {
    duration: 397.810975,
    peak: { db: -6.513508038527016, value: 0.472416, valid: true },
    rms: { db: -22.82156005551269, value: 0.072264, valid: true }
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
