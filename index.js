const express = require('express');
const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

bot.on('text', async (ctx) => {
    await ctx.sendChatAction('typing');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ctx.message.text,
        });
        await ctx.reply(response.text);
    } catch (error) {
        console.error(error);
        await ctx.reply("Xatolik yuz berdi.");
    }
});

app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
});

app.get('/', (req, res) => {
    res.send('Bot running!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

