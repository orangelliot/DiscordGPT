const OpenAI = require('openai');
const ResponseManager = require('./responseManager');
require('dotenv').config()

module.exports = class Conversation {
    constructor() {
        this.openai = new OpenAI({
            organization: process.env.GPT_ORGKEY,
            apiKey: process.env.GPT_APIKEY
        });
        this.chathistory = [{ role: 'system', content: 'you are a discord bot named clippy. you chat to users in an informal manner. respond breifly. if a message does not appear to be addressed to you reply with \'no response\'. if the user appears to be addressing other users wihout explicitly including you reply with \'no response\''}]
    }

    async request(message) {
        const noresponseregex = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;
        console.log(`attempting to send message to gpt`);
        this.chathistory.push({ role: 'user', content: message.content });
        let responsestream = await this.openai.chat.completions.create({
            messages: this.chathistory,
            model: 'gpt-4-turbo-preview',
            temperature: 1.0,
            stream: true,
        });

        const responseManager = new ResponseManager();
        const response = await responseManager.sendResponse(responsestream, message.channel);
        console.log(`gpt responds`);
        /*if(response.match(noresponseregex)){
            this.chathistory.pop();
            return -1;
        }
        else*/
        this.chathistory.push({ role: 'assistant', content: response});
        let fullchathistory = '';
        this.chathistory.forEach((msg) => fullchathistory += msg.content)
        if(fullchathistory.length > 500){
            this.summarize();
        }
        return response;
    }

    async summarize(){
        let summaryportion = this.chathistory.slice(1, Math.ceil(this.chathistory.length/2.0));
            summaryportion.push({role: 'user', content: 'summarize the conversation so far in 1000 characters or less'});
            const summary = await this.openai.chat.completions.create({
                messages: summaryportion,
                model: 'gpt-4-turbo-preview',
                temperature: 1.0,
                stream: false,
            });
            this.chathistory = [{role: 'system', content: 'you are a discord bot named clippy. you chat to users in an informal manner. respond breifly. if a message does not appear to be addressed to you reply with \'no response\'. if the user appears to be addressing other users wihout explicitly including you reply with \'no response\''},
                                {role: 'system', content: `here is a summary of the conversation so far: ${summary.choices[0].message.content}`}].concat(this.chathistory.slice(Math.ceil(this.chathistory.length/2.0) + 1, this.chathistory.length));
            let fullchathistory = '';
            this.chathistory.forEach((msg) => fullchathistory += msg.content);
    }

    async setprompt(newprompt){
        if(typeof newprompt == String)
            this.chathistory[0] = {role: 'system', content: newprompt};
        else
            console.log('attempted to set non-string prompt');
    }
}