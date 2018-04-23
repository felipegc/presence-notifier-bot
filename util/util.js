const { exec } = require('child_process');
const fs = require('fs');

var settings = {
    WEB_HOOK_URL: '',
    MSG_LOCK_SCREEN: '',
    MSG_UNLOCK_SCREEN: '',
    SO_SCREEN_LOCKED_CMD: ''
}

var validateAndSetSetting = (element) => {

    var settingName = element.split('=')[0].trim();
    var settingValue = element.split(settingName + ' =')[1].trim();

    if (!(settingName in settings) || settingValue === '') {
        throw Error(`The field ${settingName} should not exist or its value is empty.`);
    }

    settings[settingName] = settingValue;
};

var loadSettings = () => {
    try {
        var data = fs.readFileSync('./resources/settings.txt').toString('utf-8');

        var settingsFile = data.split('\n');

        settingsFile.forEach(element => {
            validateAndSetSetting(element);
        });

        return settings;
    } catch (err) {
        console.log('The file "/resources/settings.txt" could not be read or there is missing information.', err.message);
    }

    return null;
};

var isScreenLocked = (cmd, callback) => {
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log('The app could not execute the command to check if the screen is either locked or unlocked.');
        }
        retorno = stdout.includes('true');

        callback(retorno);
    });
};

var saveLog = (log) => {
    try {
        fs.appendFileSync('log.txt', log, 'utf-8');
    } catch (err) {
        console.log(`The log ${log} could not be appended to "log.txt"`);
    }
};

module.exports = {
    loadSettings,
    isScreenLocked,
    saveLog
}