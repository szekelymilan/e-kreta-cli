const { bold, red, green, white, gray } = require('chalk');
const configstore = require('configstore');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ora = require('ora');
const request = require('request-promise-native');

const utils = require('./utils');

module.exports = async directory => {
  const spinner = ora('Downloading...').start();

  try {
    const accessToken = (await utils.login())['access_token'];

    mkdirp.sync(directory);

    const lessons = JSON.parse(
      await request.get(`https://${utils.conf.get('institute')}.e-kreta.hu/mapi/api/v1/Lesson`, {
        auth: { bearer: accessToken },
      }),
    );

    const wasAssignment = {};
    let assignmentCounter = 0;

    for (let lesson of lessons) {
      if (!lesson['TeacherHomeworkId']) continue;

      const assignment = JSON.parse(
        await request.get(
          `https://${utils.conf.get(
            'institute',
          )}.e-kreta.hu/mapi/api/v1/HaziFeladat/TanarHaziFeladat/${lesson['TeacherHomeworkId']}`,
          { auth: { bearer: accessToken } },
        ),
      );

      if (!wasAssignment[assignment['Id']]) {
        wasAssignment[assignment['Id']] = true;
        assignmentCounter++;
      }

      mkdirp.sync(`${directory}/${utils.replaceIllegalChars(assignment['Tantargy'])}`);

      spinner.text = `Downloading... (${assignmentCounter} assignments)`;

      const date = new Date(assignment['FeladasDatuma']);
      const deadline = new Date(assignment['Hatarido']);

      fs.writeFileSync(
        path.resolve(
          process.cwd(),
          `${directory}/${utils.replaceIllegalChars(assignment['Tantargy'])}/${utils.toDateFileName(
            date,
          )} - ${assignment['Id']}.html`,
        ),
        `<!--
  * Lesson: ${assignment['Tantargy']}
  * Teacher: ${assignment['Rogzito']}
  * Date: ${utils.toDateString(date)}
  * Deadline: ${utils.toDateString(deadline)}
-->

${assignment['Szoveg']}
`,
      );
    }

    spinner.succeed(`Successfully downloaded ${assignmentCounter} assignments.`);
  } catch (e) {
    spinner.fail('An error occured while fetching data.');
    console.error(e);
  }
};
