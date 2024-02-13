const OpenAI = require('openai');
const ResponseManager = require('./responseManager');
require('dotenv').config()

module.exports = class Conversation {
    constructor() {
        this.openai = new OpenAI({
            organization: process.env.GPT_ORGKEY
        });
        this.chathistory = [{ role: 'system', content: 'you are a discord bot named clippy. you chat to users in an informal manner. respond breifly. if a message does not appear to be addressed to you reply with \'no response\'. if the user appears to be addressing other users wihout explicitly including you reply with \'no response\''}]
    };

    async request(message) {
        const noresponseregex = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;
        console.log(`attempting to send the message ${message.content} to gpt`)
        this.chathistory.push({ role: 'user', content: message.content })
        let responsestream = await this.openai.chat.completions.create({
            messages: this.chathistory,
            model: 'gpt-4-turbo-preview',
            temperature: 1.0,
            stream: true,
        });

        const responseManager = new ResponseManager();
        const response = await responseManager.sendResponse(responsestream, message.channel);
        console.log(`message sent to gpt! gpt responds with ${response}`)
        if(response.match(noresponseregex)){
            this.chathistory.pop();
            return -1;
        }
        else
            this.chathistory.push({ role: 'assistant', content: response});
        return response;
    };

    async setprompt(newprompt){
        if(newprompt != 0)
            this.chathistory[0] = {role: 'system', content: newprompt};
    };
};