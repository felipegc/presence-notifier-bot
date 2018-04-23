const fs = require('fs');
const axios = require('axios');

var sendNotification = (url, message, callback) => {
    axios.post(url, {'text': message}).then((result) => {
        callback(true);
    }, (err) => {
        console.log('Something went wrong.', err);
        callback(false);
    });
};

var readLastScreenEvent = () => {
    event = handleLastScreenEvent();

    if (event === null) {
        return saveScreenEvent({
            screenLocked: false
        });
    }

    return event;
}

var handleLastScreenEvent = () => {
    try {
        var screenEvent = fs.readFileSync('./bot/screen-event.json');
        return JSON.parse(screenEvent);
    } catch (err) {
        console.log('The file screen-event.json does not exist.');
        return null;
    }
};

var saveScreenEvent = (screenEvent) => {
    fs.writeFileSync('./bot/screen-event.json', JSON.stringify(screenEvent));
    return screenEvent;
};

module.exports = {
    sendNotification,
    readLastScreenEvent,
    saveScreenEvent
}