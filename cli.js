#!/usr/bin/env node

const meow = require('meow');
const { bold, red, green } = require('chalk');

const _averages = require('./src/averages');
const _reconfigure = require('./src/reconfigure');

const cli = meow(`
 ${bold('Usage')}
   $ kreta <options>

 ${bold('Options')}
   -a, --averages       Show subject averages
   -i, --interactive    Interactive mode
   --reconfigure        Reconfigure the CLI
   --config             Use a different, local config (read-only)

 ${bold('Examples')}
   See: https://github.com/szekelymilan/e-kreta-cli#examples
`,
{
  flags: {
    averages: {
      type: 'boolean',
      alias: 'a',
      default: false
    },
    interactive: {
      type: 'boolean',
      alias: 'i',
      default: false
    },
    reconfigure: {
      type: 'boolean',
      default: false
    },
    config: {
      type: 'string',
      default: undefined
    }
  }
});

const {
  averages: AVERAGES,
  interactive: INTERACTIVE,
  reconfigure: RECONFIGURE,
  config: CONFIG
} = cli.flags;

(async () => {
  let showHelp = true;

  if (RECONFIGURE) {
    await _reconfigure();
    showHelp = false;
  }

  if (AVERAGES) {
    _averages();
    showHelp = false;
  }

  if (showHelp)
    cli.showHelp();
})();
