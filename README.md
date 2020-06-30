# SACRED1: Baptism
> Analyze and accept audio submissions conditionally and programmatically.

Baptism is the first stage in the SACRED AUDIO automated workflow. It
objectifies WAV files and provides interfaces to `ffmpeg` and `sox` to produce
industry-compliant analyses of the audio data.

The module can serve as the backend for applications where the main use case is
to accept, analyze, and QC audio file submissions. By providing easy interfaces
for audio file introspection, generation of visual assets from audio file
measurements, and validation to standard audio industry specifications, Baptism
aims to support most of the basic considerations that are necessary to iron out
new audio and music projects.

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
`track.stats()`, `track.silence()`, `track.soxi()` and `track.spectrogram()`
methods. Callback provides an object containing each `Track` object's probe
results.

#### `album.validate`

Returns object containing validation information for all the `Track` objects
added to the `Album`.

### `const flags = bap.flags`

An object containing command line flags for various spawned child processes.

### `bap.soxi(filename, callback)`
Callback returns an object containing media file formatting metadata, such as
bit depth, sampling frequency, and channel count. Information is provided by
the `soxi` command line application, provided by the
[SoX](http://sox.sourceforge.net/) application.

This method is meant to be called by the `Track` class, so do not use this
method directly in your code.

### `bap.stats(filename, callback)`

Returns an object containing dynamics analysis measurements provided by the 
[SoX](http://sox.sourceforge.net/) application.

### `bap.spectrogram(filename, callback)`

Returns a file path to a PNG of the file's spectrogram

### `const Release = bap.Release`

Class representations of physical and digital audio media products.

#### `Release.add(item)`

Add an `Album` or a single `Track` to the `Release` object.

#### `const cd = new Release.CD([opts])`

An object which represents a CD album release product. Extends `Release`.

#### `const digital = new Release.Digital([opts])`

An object which represents a digital release product. Extends `Release`. 

#### `const vinyl = new Release.Digital([opts])`

An object which represents a vinyl release product. Extends `Release`.

Optional `opts` object accepts the following flags:

`opts.size`: Declare the size of the vinyl disc. Accepted values are `7`, `10`,
or `12`.

`opts.speed`: Declare the rotation speed of the vinyl disc. Accepted values are
`33` or `45`.

### `const track = new bap.Track(filename, [opts])`

An object, which represents a single audio file. Extends
[nanoresource](https://github.com/little-core-labs/nanoresource). Accepts an
optional options object to specify track number, via `opts.trackNumber`.

#### `track.size(callback)`

Callback returns the file size of the file belonging to the `Track`.

#### `track.silence(callback)`

Checks the `Track` object for silence at the beginning and end of the file.
Callback returns an object describing the silences as well as validation results.

#### `track.soxi(callback)`

Runs a `soxi` analysis on the filename belonging to the `Track`. Callback
returns the relevant `soxi` information which is also written to `Track.format`.

#### `track.spectrogram(callback)`

Calls `bap.spectrogram()` on the `Track` object. `track.spectrogram` becomes the
base64 byte-string of the generated PNG image. When finished, the output file
path to the PNG is written returned by the callback, as well as written to
`track.spectrogramFile`.

#### `track.stats(callback)`

Calls `bap.stats()` on the `Track` object. `track.stats` becomes the data
object returned by the `bap.stats()` method.
