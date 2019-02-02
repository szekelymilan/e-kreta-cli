const { Base64 } = require('js-base64');
const { bold, red, green } = require('chalk');
const configstore = require('configstore');
const Fuse = require('fuse.js');
const inquirer = require('inquirer');
const utils = require('./utils');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = async () => {
  const institutes = await utils.getInstitutes();

  const fuse = new Fuse(institutes, {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'Name',
      'InstituteCode'
    ]
  });

  const answers = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'institute',
      message: 'Select an institute:',
      source: function(answers, input = '') {
        return new Promise(function(resolve) {
          if (input.length < 1)
            return resolve(institutes.map(e => e.Name.trim()));

          resolve(fuse.search(input).map(e => e.Name.trim()));
        });
      }
    },
    {
      type: 'input',
      name: 'username',
      message: 'Username:'
    },
    {
      type: 'input',
      name: 'password',
      message: 'Password:'
    }
  ]);

  const conf = new configstore(utils.pkg.name);
  conf.set('institute', institutes.filter(x => x.Name.trim() == answers['institute'])[0]['InstituteCode']);
  conf.set('username', Base64.encode(answers['username']));
  conf.set('password', Base64.encode(answers['password']));

  console.log(`${green('Successfully updated configuration.')}`)
};
