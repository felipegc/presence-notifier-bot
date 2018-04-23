const fs = require('fs');

const bot = require('./bot/bot');
const util = require('./util/util');


var settings = util.loadSettings();

var screenEventListener = () => {
    util.isScreenLocked(settings.SO_SCREEN_LOCKED_CMD, (isLocked) => {
        var now = new Date();

        lastEvent = bot.readLastScreenEvent();
        if (lastEvent.screenLocked !== isLocked) {
            msgToBeSent = isLocked ? settings.MSG_LOCK_SCREEN : settings.MSG_UNLOCK_SCREEN;

            bot.sendNotification(settings.WEB_HOOK_URL, msgToBeSent, (sent) => {
                if (sent) {
                    event = bot.saveScreenEvent({
                        screenLocked: isLocked
                    });
                    util.saveLog(`${new Date().toString()} The message was sent with the following seetings: \n WEB_HOOK -> ${settings.WEB_HOOK_URL} \n MSG -> ${msgToBeSent} \n SCREEN_EVENT -> ${JSON.stringify(event)}.\n`);
                } else {
                    util.saveLog(`${new Date().toString()} The message could not be delivered.\n`);
                }
            });
        }
    });

    setTimeout(screenEventListener, 3000);
}

if (settings != null) {
    screenEventListener();
}
