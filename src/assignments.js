const { bold, red, green, white, gray } = require('chalk');
const configstore = require('configstore');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ora = require('ora');

const utils = require('./utils');
const request = utils.request;

module.exports = async (directory, startDate, endDate) => {
  if (new Date(Date.parse(startDate)) > new Date(Date.parse(endDate)))
    return console.error(red('Invalid date interval.'));

  const spinner = ora('Downloading...').start();

  try {
    const accessToken = (await utils.login())['access_token'];

    mkdirp.sync(directory);

    const lessons = JSON.parse(
      await request.get(
        `https://${utils.conf.get(
          'institute',
        )}.e-kreta.hu/mapi/api/v1/Lesson?fromDate=${startDate}&toDate=${endDate}`,
        {
          auth: { bearer: accessToken },
        },
      ),
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

      spinner.text = `Downloading... (${assignmentCounter} assignment${
        assignmentCounter == 1 ? '' : 's'
      })`;

      const date = new Date(assignment['FeladasDatuma']);
      const deadline = new Date(assignment['Hatarido']);

      mkdirp.sync(`${directory}/${utils.replaceIllegalChars(assignment['Tantargy'].trim())}`);

      fs.writeFileSync(
        path.resolve(
          process.cwd(),
          `${directory}/${utils.replaceIllegalChars(
            assignment['Tantargy'].trim(),
          )}/${utils.toDateString(date)} - ${assignment['Id']}.html`,
        ),
        `<!--
  * Lesson: ${assignment['Tantargy'].trim()}
  * Teacher: ${assignment['Rogzito'].trim()}
  * Date: ${utils.toDateTimeString(date)}
  * Deadline: ${utils.toDateTimeString(deadline)}
-->

${assignment['Szoveg']}
`,
      );
    }

    spinner.succeed(
      `Successfully downloaded ${assignmentCounter} assignment${
        assignmentCounter == 1 ? '' : 's'
      }.`,
    );
  } catch (e) {
    spinner.fail('An error occured while fetching data.');
    console.error(e);
  }
};
