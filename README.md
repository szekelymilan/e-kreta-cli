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
   $ kreta <assignments|averages|reconfigure> [options]

   Use 'kreta' for interactive mode.

Options
  assignments:
    -o, --output       Output folder (defaults to assignments)

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

#### Download assignments to My Assignments folder

```
$ kreta assignments -o "My Assignments"
```

## Contributors

- Many thanks to [boapps](https://github.com/boapps) for making [e-kreta-api-docs](https://github.com/boapps/e-kreta-api-docs).

## License

MIT © [Milan Szekely](https://github.com/szekelymilan)
