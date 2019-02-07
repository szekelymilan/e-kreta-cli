#!/usr/bin/env node

const { bold } = require('chalk');
const inquirer = require('inquirer');
const meow = require('meow');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');
const _averages = require('./src/averages');
const _reconfigure = require('./src/reconfigure');

const cli = meow(`
 ${bold('Usage')}
   $ kreta <options>

 ${bold('Options')}
   -a, --averages       Show subject averages
   -i, --interactive    Interactive mode
   --reconfigure        Update configuration

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

async function _interactive() {
  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'tasks',
      message: 'Select tasks:',
      choices: [
        { name: 'Update configuration', value: 'reconfigure', checked: false },
        { name: 'Show averages', value: 'averages', checked: false }
      ]
    }
  ]);

  for (const task of answers['tasks']) {
    switch (task) {
      case 'averages':
        await _averages();
        break;
      case 'reconfigure':
        await _reconfigure();
        break;
    }
  }
}

(async () => {
  let noFlag = true;

  updateNotifier({pkg}).notify();

  if (INTERACTIVE) {
    await _interactive();
    return;
  }

  if (RECONFIGURE) {
    await _reconfigure();
    noFlag = false;
  }

  if (AVERAGES) {
    _averages();
    noFlag = false;
  }

  if (noFlag)
    await _interactive();

  process.exit();
})();
