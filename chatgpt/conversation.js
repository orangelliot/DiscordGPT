const { gpt } = require('../config.json');
const OpenAI = require('openai')

module.exports = class Conversation {
    constructor() {
        this.openai = new OpenAI({
            organization: gpt.orgKey
        });
        this.chathistory = [{ role: 'system', content: 'you are a discord bot named clippy. you chat to users in an informal manner. if a message does not appear to be addressed to you reply with \'no response\'. if the user appears to be addressing other users wihout explicitly including you reply with \'no response\''}]
    };

    async request(message) {
        const noresponseregex = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;
        console.log(`attempting to send the message ${message} to gpt`)
        this.chathistory.push({ role: 'user', content: message })
        const response = await this.openai.chat.completions.create({
            messages: this.chathistory,
            model: 'gpt-4',
        });
        console.log(`message sent to gpt! gpt responds with ${response.choices[0].message.content}`)
        if(response.choices[0].message.content.match(noresponseregex)){
            this.chathistory.pop();
            return -1;
        }
        this.chathistory.push({ role: 'assistant', content: response.choices[0].message.content})
        return response.choices[0].message.content;
    };

    async setprompt(newprompt){
        if(newprompt != 0)
            this.chathistory[0] = {role: 'system', content: newprompt};
    };
};