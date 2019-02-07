const { bold, red, green, white, gray } = require('chalk');
const configstore = require('configstore');
const request = require('request-promise-native');
const utils = require('./utils');

module.exports = async () => {
  const credentials = await utils.login_configStore();

  if (!credentials)
    return console.log(`${red('Error occured while fetching data.')}\n`);

  const studentData = await request.get(`https://${utils.conf.get('institute')}.e-kreta.hu/mapi/api/v1/Student`, { auth: { bearer: credentials['access_token'] } });
  const subjectAverages = JSON.parse(studentData)['SubjectAverages'];
  subjectAverages.sort((a, b) => a['Subject'].localeCompare(b['Subject']));

  console.log(`${bold('Subject averages:')}`);

  subjectAverages.forEach(subj => {
    if (subj['Value'] == 0.00)
      return false;

    let differenceText;
    if (subj['Difference'] < 0)
      differenceText = red(`(${subj['Difference'].toFixed(2)})`);
    else if (subj['Difference'] > 0)
      differenceText = green(`(+${subj['Difference'].toFixed(2)})`);
    else
      differenceText = white(`(${subj['Difference'].toFixed(2)})`);

    console.log(`  ${subj['Subject']}: ${bold(subj['Value'].toFixed(2))} ${differenceText}`);
  });

  subjectAverages.forEach(subj => {
    if (subj['Value'] == 0.00)
      return console.log(gray(`  ${subj['Subject']}: ${subj['Value'].toFixed(2)} (${subj['Difference'].toFixed(2)})`));
  });

  return;
}
