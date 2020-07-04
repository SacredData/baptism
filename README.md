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
  newAlbum.query()[0].spectrogram((err, spec) => {
    console.log(`Spectrogram output to: ${spec}`)
    newAlbum.query()[0].waveform((err, wave) => {
      console.log(`Waveform output to: ${wave}`)
    })
  })
})
```

```
{
  '/home/gwohl/code/sacreddata/baptism/example/example.wav': {
    duration: 10,
    peak: { db: -0.018041945998171376, value: 0.997925, valid: false },
    rms: { db: -15.695817254036564, value: 0.164138, valid: true }
  }
}
Spectrogram output to: /home/gwohl/code/sacreddata/baptism/example/example.wav.png
Waveform output to: /home/gwohl/code/sacreddata/baptism/example/example.wav_waveform.png
```

## Usage

### Audio Files

`Baptism` only works on WAV audio files and its extension formats, such as
broadcast wave (BWF).

A WAV file is objectified by instantiating a `new Baptism.Track`, or its
extension classes, `Premaster` and `Master`. However, it is recommended to use 
the `Album` or `Release` classes to create `Track` objects. A `Premaster` is 
meant to be added to an `Album`, while a `Master` is meant to be added to a 
`Release`.

### Releases

An `Album` is instantiated by passing it a directory of WAV files. In order to
guarantee proper track ordering, ensure WAV file path basenames begin with a
[leading zero](https://en.wikipedia.org/wiki/Leading_zero), then the track number,
followed by the track title, i.e., `03 - This Is A Song Title.wav`. Other files
present in the directory lacking the `.wav` file extension will be ignored.

A `Release` is an objectified version of a physical or digital music release,
and it can be instantiated by calling `new Baptism.Release`. However, it is 
recommended to call one of its class extensions, `Vinyl`, `Stream`, `Download`,
and `CD`. An `Album` can be added to a `Release` via its `Release.add()` method.

### Assets

An ancillary file asset such as a cover art image, a cue sheet, credits, etc., 
may be objectified by the `Asset` class. It can be instantiated via 
`new Baptism.Asset`. Certain class extensions exist for specific asset features
, including `CoverArt`. Additional class extensions are in development and 
forthcoming in a future release.

## API
> WIP

### `const bap = require('baptism')`

Import `baptism`.

### `const album = new bap.Album(dir, [opts])`

An object, which provides one or more `Track` objects. Extends
[nanoresource-pool](https://github.com/little-core-labs/nanoresource-pool).

The optional `opts` object allows for designating the following flags:

`opts.metadata`: An object to specify metadata about the `Album`. Accepted keys
are `opts.metadata.artist`, `opts.metadata.album`, `opts.metadata.title`, and
`opts.metadata.comment`. This metadata will be written to any WAVs output from
the `Album` object.

#### `album.probe(callback)`

Batch processes each `Track` in the `Album`, calling the `Track` object's
`track.stats()`, `track.silence()`, and `track.soxi()` methods. Callback
provides an object containing each `Track` object's probe results.

#### `album.validate`

Returns object containing validation information for all the `Track` objects
added to the `Album`.

### `const asset = new bap.Asset(file, [opts])`

An object, which represents and objectifies a single `Asset` meant to be added
to an `Album` prior to completion. Accepts an optional `opts` object, with the
following keys:

`opts.hint`: A string that provides an indication of the function of the asset.

Extends [`nanoresource`](https://github.com/mafintosh/nanoresource).

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

### `const master = bap.Master(filename, [opts])`

An object representing a mastered music track. Extends `bap.Track`. Accepts an
optional `opts` object with the following configuration parameters:

`opts.parent`: Specify the `Track` object which served as the premaster source
file for this `Master`. This property can also be set later via
`bap.Master.parent`.

#### `master.compare(callback)`

Compare the `Master` audio file's dynamics and formatting properties with its
parent `Track`. Performs necessary analyses on the `Master` and `Track` objects
if the information is not already available. Callback returns an object which
provides comparison results and validations validations.

### `const premaster = bap.Premaster(filename, [opts])`

> WIP

### `const Release = bap.Release`

Class representations of physical and digital audio media products.

#### `Release.add(item)`

Add an `Album` or a single `Track` to the `Release` object.

#### `const cd = new Release.CD([opts])`

An object which represents a CD album release product. Extends `Release`.

#### `const digital = new Release.Digital([opts])`

An object which represents a digital release product. Extends `Release`. 

#### `const vinyl = new Release.Vinyl([opts])`

An object which represents a vinyl release product. Extends `Release`.

Optional `opts` object accepts the following flags:

`opts.size`: Declare the size of the vinyl disc. Accepted values are `7`, `10`,
or `12`.

`opts.speed`: Declare the rotation speed of the vinyl disc. Accepted values are
`33` or `45`.

### `const track = new bap.Track(filename, [opts])`

An object, which represents a single audio file. Extends
[nanoresource](https://github.com/mafintosh/nanoresource). Accepts an optional
`opts` object to specify track number, via `opts.trackNumber`.

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

#### `track.wav`

When `Track.source` points to a WAV file, `track.wav` will be provided upon
instantiation, giving full access to the file via the
[`WaveFile`](https://github.com/rochars/wavefile) npm module. This allows users
to set/remove RIFF tags, parse WAV chunks, modify WAV formatting, etc.

#### `track.waveform(callback)`

Generates a waveform PNG of the `Track`'s file. `track.waveform` becomes the
base64 byte-string of the generated PNG image. When finished, the output file
path to the PNG is written returned by the callback, as well as written to
`track.waveformFile`.
