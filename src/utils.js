const { Base64 } = require('js-base64');
const { bold, red } = require('chalk');
const configstore = require('configstore');
const request = require('request-promise-native').defaults({
  headers: { 'User-Agent': 'Kreta.Ellenorzo/2.9.11.2020033003 (Android; 0.0)' },
});

exports.pkg = require('../package.json');
exports.conf = new configstore(exports.pkg.name);
exports.request = request;

exports.getInstitutes = async () => {
  return JSON.parse(
    await request.get('https://kretaglobalmobileapi.ekreta.hu/api/v1/Institute', {
      headers: { apiKey: '7856d350-1fda-45f5-822d-e1a2f3f1acf0' },
    }),
  );
};

async function loginUtil(institute, username, password) {
  try {
    return JSON.parse(
      await request.post(`https://${institute}.e-kreta.hu/idp/api/v1/Token`, {
        body: `institute_code=${institute}&userName=${username}&password=${password}&grant_type=password&client_id=919e0c1c-76a2-4646-a2fb-7085bbbf3c56`,
      }),
    );
  } catch (e) {
    return e.statusCode || -1;
  }
}

exports.login = async () => {
  if (
    (exports.conf.get('institute') || '') == '' ||
    (exports.conf.get('username') || '') == '' ||
    (exports.conf.get('password') || '') == ''
  ) {
    console.error(`${red('Required settings are missing.')} ${bold('Please run reconfigure.')}`);
    return false;
  }

  const response = await loginUtil(
    exports.conf.get('institute'),
    Base64.decode(exports.conf.get('username')),
    Base64.decode(exports.conf.get('password')),
  );

  if (response == -1) {
    console.error(
      `${red('Invalid institute in configuration.')} ${bold('Please run reconfigure.')}`,
    );
    return false;
  }

  if (!response['access_token']) {
    console.error(
      `${red('Invalid username or password in configuration.')} ${bold('Please run reconfigure.')}`,
    );
    return false;
  }

  return response;
};

exports.replaceIllegalChars = path => {
  return path.replace(/[/\\?%*:|"<>]/g, '-');
};

exports.toDateTimeString = date => {
  return (
    date.getFullYear() +
    '. ' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '. ' +
    ('0' + date.getDate()).slice(-2) +
    '. ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
    ('0' + date.getSeconds()).slice(-2)
  );
};

exports.toDateString = date => {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2)
  );
};

exports.isValidDate = dateString => {
  if (!dateString || !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
  const date = new Date(dateString);
  return (date.getTime() || date.getTime() === 0) && date.toISOString().slice(0, 10) === dateString;
};
