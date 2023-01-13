const { App } = require('@slack/bolt');

require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});



(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

app.message(/hello|hi|hey/, async ({message, say}) => {
    console.log("RECEIVED MESSAGE", message)
    await say(`Wassup, <@${message.user}>`);
})