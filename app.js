const { App, subtype } = require('@slack/bolt');

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

// Snitching on edited messages
app.message(subtype('message_changed'), ({message, say}) => {
    console.log("RECEIVED EDITED MESSAGE", message)
    say(`@channel, <@${message.message.user}> edited their message!\nFrom: ${message.previous_message.text}\nTo: ${message.message.text}`)
})

// Snitching on deleted messages
app.message(subtype('message_deleted'), async ({message, say}) => {
    console.log("DELETED MESSAGE", message)
    const reply = await say(`<!channel>, <@${message.previous_message.user}> deleted their message!`)
    await say({text: `<@${message.previous_message.user}> had said\n*${message.previous_message.text}*`, thread_ts: reply.ts})
})