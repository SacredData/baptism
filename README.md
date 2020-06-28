# Baptism
> Analyze and accept audio submissions conditionally and programmatically.

## Status
> In Development

## Installation

```sh
$ npm -i baptism
```

## API
> WIP

### `const bap = require('baptism')`

Import `baptism`.

### `album = new bap.Album(dir)`

An object, which provides one or more `Track` objects. Extends
[nanoresource-pool](https://github.com/little-core-labs/nanoresource-pool).

### `bap.stats(filename, callback)`

Returns an object containing dynamics analysis measurements provided by the 
[SoX](http://sox.sourceforge.net/) application.

### `bap.spectrogram(filename, callback)`

Returns a file path to a PNG of the file's spectrogram.

### `track = new bap.Track(filename)`

An object, which represents a single audio file. Extends
[nanoresource](https://github.com/little-core-labs/nanoresource).
