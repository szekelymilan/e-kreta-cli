# [![e-Kréta CLI](static/banner.png)](https://github.com/szekelymilan/e-kreta-cli)

> 📚 Check your electronic diary - from right inside your terminal.

[![PRs Welcome](https://badgen.net/badge/PRs/welcome/green)](https://github.com/szekelymilan/e-kreta-cli/pulls)
[![Latest Release](https://badgen.net/github/release/szekelymilan/e-kreta-cli)](https://github.com/szekelymilan/e-kreta-cli/releases/latest)
[![MIT License](https://badgen.net/badge/license/MIT/blue)](https://github.com/szekelymilan/e-kreta-cli/blob/master/LICENSE)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributors](#contributors)
- [License](#license)

## Description

Check your electronic diary in a second, by running a single command.

Too lazy for typing? Run the CLI in **interactive mode**! 😎

## Features

- ⚡ Interactive mode
- 💾 Saves login credentials
- 🖥 Shows subject averages
- 🏠 Downloads assignments
- ✉ Downloads messages
- ✅ Tested
- ⛏ Maintained

## Installation

#### npm

```
$ npm i -g e-kreta-cli
```

#### yarn

```
$ yarn global add e-kreta-cli
```

## Usage

```
$ kreta --help

  Check your electronic diary - from right inside your terminal.

  Usage
    $ kreta <assignments|averages|messages|reconfigure> [options]

    Use 'kreta' for interactive mode.

  Options
    assignments:
      -o,   --output       Output folder
      --sD, --startDate    Start date of interval (yyyy-mm-dd)
      --eD, --endDate      End date of interval (yyyy-mm-dd)

    messages:
      -o,   --output       Output folder

  Examples
    See: https://github.com/szekelymilan/e-kreta-cli#examples
```

## Examples

#### Reconfigure

```
$ kreta reconfigure
```

#### Show averages

```
$ kreta averages
```

#### Download assignments to My Assignments folder (from 2020-03-16 to 2020-03-20)

```
$ kreta assignments -o "My Assignments" --sD="2020-03-16" --eD="2020-03-20"
```

#### Download messages to My Messages folder

```
$ kreta messages -o "My Messages"
```

## Contributors

- Many thanks to [boapps](https://github.com/boapps) for making [e-kreta-api-docs](https://github.com/boapps/e-kreta-api-docs).
- Thanks to [zoltansx](https://github.com/zoltansx) for lots of great ideas.

## License

MIT © [Milan Szekely](https://github.com/szekelymilan)
