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
- [License](#license)

## Description

Check your electronic diary in a second, by running a single command.

Too lazy for typing the flags? Run the CLI in **interactive mode**! 😎

## Features

- ⚡ Interactive mode via `--interactive`
- 💾 Saves login credentials
- 🖥 Shows subject averages
- ✅ Tested
- ⛏ Maintained

## Installation

#### npm

```
$ npm i -g e-kreta-cli
```

## Usage

```
$ kreta --help

Check your electronic diary - from right inside your terminal.

Usage
  $ kreta <options>

Options
  -a, --averages       Show subject averages
  -i, --interactive    Interactive mode
  --reconfigure        Update configuration

Examples
  See: https://github.com/szekelymilan/e-kreta-cli#examples
```

## Examples

#### Reconfigure

```
$ kreta --reconfigure
```

#### Show averages

```
$ kreta -a
```

## License

MIT © [Milan Szekely](https://github.com/szekelymilan)
