const { App, subtype } = require('@slack/bolt');

require('dotenv').config();

const NIGEN_URI = process.env.NIGEN_URI

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});



(async () => {
    await app.start();
    console.log('⚡️ Bolt app is running!');
})();

app.message(/(hello|hi|hey)/i, async ({ message, say }) => {
    console.log("[LOG] I am being greated by", message.username)
    console.log(message)
    await say(`Wassup, <@${message.user}>`);
})

// Snitching on deleted messages
app.message(subtype('message_deleted'), async ({ message, say }) => {
    const user = await getUserInfo(message.previous_message.user)
    const userInfo = {
        name: user ? user.profile.display_name : undefined,
        avatar: user ? user.profile.image_72 : undefined,
        id: user ? user.id : undefined,
        locale: user ? user.locale : undefined,
    }
    console.log({tz: user.tz, message_ts: message.previous_message.ts})
    const compositionDate = new Date(Number(Math.floor(message.previous_message.ts) * 1000)).toLocaleString('en-US', {
        timeZone: user.tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })

    const thread_ts = message.previous_message.thread_ts ?? message.previous_message.ts

    const reply = await say({
        text: `<!channel>, <@${message.previous_message.user}> deleted their message!`,
        thread_ts,
    })


    const screenshotURI = `${NIGEN_URI}?message=${encodeURI(message.previous_message.text)}&username=${encodeURI(userInfo.name)}&time=${encodeURI(compositionDate)}&avatar=${userInfo.avatar}`
    await say({
        text: ``,
        thread_ts: reply.ts,
        attachments: [
            {
                fallback: "Removed message info",
                image_url: screenshotURI,
                thumb_url: screenshotURI,
                text: 'screenshot',

            }
        ]
    })
    console.log(screenshotURI)
})

async function getUserInfo(userId) {
    return (await app.client.users.info({ user: userId })).user ?? null
}