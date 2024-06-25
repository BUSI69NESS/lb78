import process from 'node:process';
import TelegramBot from 'node-telegram-bot-api';
import { logger } from './logger.js';
import { charCounter } from './metrics.js';


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const text = msg.text;
    let res = "Wrong input";
    if (text.startsWith("/message")) {
        const split = text.split(" ");
        const message = split
            .filter((val, i) => i !== 0)
            .join(" ");

        await logger.emit('user_message', {username: msg.chat.username, user_message: message});
        charCounter.inc(message.length);
        res = `Amount characters in message: '${message}' was recorded`
    }
    bot.sendMessage(msg.chat.id, res);
});
