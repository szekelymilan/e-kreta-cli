const { bold, red, green, white, gray } = require('chalk');
const configstore = require('configstore');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ora = require('ora');

const utils = require('./utils');
const request = utils.request;

module.exports = async directory => {
  const spinner = ora('Downloading...').start();

  try {
    const accessToken = (await utils.login())['access_token'];

    mkdirp.sync(directory);

    const messages = JSON.parse(
      await request.get(
        'https://eugyintezes.e-kreta.hu/integration-kretamobile-api/v1/kommunikacio/postaladaelemek/sajat',
        {
          auth: { bearer: accessToken },
        },
      ),
    );

    const wasMessage = {};
    let messageCounter = 0;

    for (let fMessage of messages) {
      const message = JSON.parse(
        await request.get(
          `https://eugyintezes.e-kreta.hu/integration-kretamobile-api/v1/kommunikacio/postaladaelemek/${
            fMessage['azonosito']
          }`,
          { auth: { bearer: accessToken } },
        ),
      );

      if (!wasMessage[message['azonosito']]) {
        wasMessage[message['azonosito']] = true;
        messageCounter++;
      }

      spinner.text = `Downloading... (${messageCounter} message${messageCounter == 1 ? '' : 's'})`;

      const date = new Date(message['uzenet']['kuldesDatum']);

      mkdirp.sync(
        `${directory}/${utils.replaceIllegalChars(
          message['uzenet']['feladoNev'].trim(),
        )}/${utils.replaceIllegalChars(utils.toDateString(date))} - ${message['azonosito']}`,
      );

      fs.writeFileSync(
        path.resolve(
          process.cwd(),
          `${directory}/${utils.replaceIllegalChars(
            message['uzenet']['feladoNev'].trim(),
          )}/${utils.replaceIllegalChars(utils.toDateString(date))} - ${
            message['azonosito']
          }/message.html`,
        ),
        `<!--
  * Teacher: ${message['uzenet']['feladoNev'].trim()}
  * Date: ${utils.toDateTimeString(date)}
  * Subject: ${message['uzenet']['targy']}
-->

${message['uzenet']['szoveg']}
`,
      );

      for (let attachment of message['uzenet']['csatolmanyok']) {
        const data = Buffer.from(
          await request.get(
            `https://eugyintezes.e-kreta.hu/integration-kretamobile-api/v1/dokumentumok/uzenetek/${
              attachment['azonosito']
            }`,
            { auth: { bearer: accessToken }, encoding: null },
          ),
          'utf8',
        );

        fs.writeFileSync(
          `${directory}/${utils.replaceIllegalChars(
            message['uzenet']['feladoNev'].trim(),
          )}/${utils.replaceIllegalChars(utils.toDateString(date))} - ${message['azonosito']}/${
            attachment['fajlNev']
          }`,
          data,
        );
      }
    }

    spinner.succeed(
      `Successfully downloaded ${messageCounter} message${messageCounter == 1 ? '' : 's'}.`,
    );
  } catch (e) {
    spinner.fail('An error occured while fetching data.');
    console.error(e);
  }
};
