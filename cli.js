#!/usr/bin/env node

const { bold } = require('chalk');
const inquirer = require('inquirer');
const meow = require('meow');
const updateNotifier = require('update-notifier');

inquirer.registerPrompt('datepicker', require('inquirer-datepicker'));

const utils = require('./src/utils');
const assignments = require('./src/assignments');
const averages = require('./src/averages');
const messages = require('./src/messages');
const reconfigure = require('./src/reconfigure');

const cli = meow(
  `
 ${bold('Usage')}
   $ kreta <assignments|averages|messages|reconfigure> [options]

   Use 'kreta' for interactive mode.

 ${bold('Options')}
   assignments:
     -o,   --output       Output folder
     --sD, --startDate    Start date of interval (yyyy-mm-dd)
     --eD, --endDate      End date of interval (yyyy-mm-dd)

   messages:
     -o,   --output       Output folder

 ${bold('Examples')}
   See: https://github.com/szekelymilan/e-kreta-cli#examples
`,
  {
    flags: {
      output: {
        type: 'string',
        alias: 'o',
      },
      startDate: {
        type: 'string',
        alias: 'sD',
      },
      endDate: {
        type: 'string',
        alias: 'eD',
      },
    },
  },
);

const { output: OUTPUT, startDate: START_DATE, endDate: END_DATE } = cli.flags;

async function doTask(task) {
  switch (task) {
    case 'reconfigure':
      await reconfigure();
      break;
    case 'assignments':
      const startDate = utils.isValidDate(START_DATE)
        ? START_DATE
        : utils.toDateString(
            (await inquirer.prompt([
              {
                type: 'datepicker',
                name: 'date',
                message: 'Select start date:',
                format: ['Y', '-', 'MM', '-', 'DD'],
                min: {
                  year: 1970,
                  month: 1,
                  day: 1,
                },
                max: {
                  year: utils.isValidDate(END_DATE)
                    ? END_DATE.split(/\D/)[0]
                    : new Date().getFullYear(),
                  month: utils.isValidDate(END_DATE)
                    ? END_DATE.split(/\D/)[1]
                    : new Date().getMonth() + 1,
                  day: utils.isValidDate(END_DATE) ? END_DATE.split(/\D/)[2] : new Date().getDate(),
                },
              },
            ]))['date'],
          );

      const endDate = utils.isValidDate(END_DATE)
        ? END_DATE
        : utils.toDateString(
            (await inquirer.prompt([
              {
                type: 'datepicker',
                name: 'date',
                message: 'Select end date:',
                format: ['Y', '-', 'MM', '-', 'DD'],
                min: {
                  year: startDate.split(/\D/)[0],
                  month: startDate.split(/\D/)[1],
                  day: startDate.split(/\D/)[2],
                },
                max: {
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1,
                  day: new Date().getDate(),
                },
              },
            ]))['date'],
          );

      await assignments(
        OUTPUT ||
          (await inquirer.prompt([
            {
              type: 'input',
              name: 'output',
              message: 'Output folder:',
              default: 'assignments',
            },
          ]))['output'],
        startDate,
        endDate,
      );
      break;
    case 'averages':
      await averages();
      break;
    case 'messages':
      await messages(
        OUTPUT ||
          (await inquirer.prompt([
            {
              type: 'input',
              name: 'output',
              message: 'Output folder:',
              default: 'messages',
            },
          ]))['output'],
      );
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
        { name: 'Update configuration', value: 'reconfigure', checked: false },
        { name: 'Show subject averages', value: 'averages', checked: false },
        { name: 'Download assignments', value: 'assignments', checked: false },
        { name: 'Download messages', value: 'messages', checked: false },
      ],
    },
  ]);

  for (const task of prompt['tasks']) await doTask(task);
}

(async () => {
  updateNotifier({ pkg: utils.pkg, updateCheckInterval: 1000 * 60 * 60 * 3 }).notify({
    isGlobal: true,
  });

  await doTask(cli.input[0]);
  process.exit();
})();
