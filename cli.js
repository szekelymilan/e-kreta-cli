#!/usr/bin/env node

const { bold } = require('chalk');
const inquirer = require('inquirer');
const meow = require('meow');
const updateNotifier = require('update-notifier');

const utils = require('./src/utils');
const assignments = require('./src/assignments');
const averages = require('./src/averages');
const reconfigure = require('./src/reconfigure');

const cli = meow(
  `
 ${bold('Usage')}
   $ kreta <assignments|averages|reconfigure> [options]

   Use 'kreta' for interactive mode.

 ${bold('Options')}
   assignments:
     -o, --output       Output folder (defaults to assignments)

 ${bold('Examples')}
   See: https://github.com/szekelymilan/e-kreta-cli#examples
`,
  {
    flags: {
      output: {
        type: 'string',
        alias: 'o',
      },
    },
  },
);

const { output: OUTPUT } = cli.flags;

async function doTask(task) {
  switch (task) {
    case 'assignments':
      let output =
        OUTPUT ||
        (await inquirer.prompt([
          {
            type: 'input',
            name: 'output',
            message: 'Output folder:',
            default: 'assignments',
          },
        ]))['output'];

      await assignments(output);
      break;
    case 'averages':
      await averages();
      break;
    case 'reconfigure':
      await reconfigure();
      break;
    default:
      await interactive();
      break;
  }
}

async function interactive() {
  const prompt = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'tasks',
      message: 'Select tasks:',
      choices: [
        { name: 'Download assignments', value: 'assignments', checked: false },
        { name: 'Show subject averages', value: 'averages', checked: false },
        { name: 'Update configuration', value: 'reconfigure', checked: false },
      ],
    },
  ]);

  for (const task of prompt['tasks']) await doTask(task);
}

(async () => {
  let noFlag = true;

  updateNotifier({ pkg: utils.pkg }).notify();

  await doTask(cli.input[0]);

  process.exit();
})();
