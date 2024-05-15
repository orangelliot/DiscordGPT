const OpenAI = require('openai');
const ResponseHandler = require('./responseHandler.js');
const { model } = require('../config.json');
const dataController = require('../data/dataController.js');
require('dotenv').config()

NAME_INDEX = 0
INITIAL_PROMPT_INDEX = 1
NO_RESPONSE_STRING = 'if a message does not appear to be addressed to you reply with \'no response\'. if the user appears to be addressing other users wihout explicitly including you reply with \'no response\'';

module.exports = class Conversation {
    constructor(guildid, channelid) {
        this.openai = new OpenAI({
            organization: process.env.GPT_ORGKEY,
            apiKey: process.env.GPT_APIKEY
        });
        this.chathistory = [{ role: 'system', content: 0},
                            { role: 'system', content: 0},
                            { role: 'system', content: NO_RESPONSE_STRING}];
                            
        this.setName(dataController.appdata.guilds[guildid].channels[channelid].name)
        this.setPrompt(dataController.appdata.guilds[guildid].channels[channelid].initial_prompt);
    }

    async request(message) {
        //const noresponseregex = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;
        console.log(`attempting to send message to gpt`);
        //console.log(this.chathistory[NAME_INDEX], this.chathistory[INITIAL_PROMPT_INDEX])
        this.chathistory.push({role: 'user', content: `${message.author.username}:${message.content}`});
        let responsestream = null
        console.log(this.chathistory);
        try {
            responsestream = await this.openai.chat.completions.create({
                messages: this.chathistory,
                model: model,
                temperature: 1.0,
                stream: true,
            });
        } catch (error) {
            if(error instanceof OpenAI.RateLimitError)
                await message.channel.send('Rate limit reached, please try again later');
            else
                await message.channel.send(error);
            return -1;
        }
        console.log(`gpt responds`);
        const responseHandler = new ResponseHandler();
        let response = null;
        try {
            response = await responseHandler.sendResponse(responsestream, message.channel);
        } catch (error) {
            await message.channel.send(error);
        }
        /*if(response.match(noresponseregex)){
            this.chathistory.pop();
            return -1;
        }
        else*/
        this.chathistory.push({ role: 'assistant', content: response});
        let fullchathistory = '';
        this.chathistory.forEach((msg) => fullchathistory += msg.content)
        //console.log(fullchathistory);
        if(fullchathistory.length > 20000){
            this.summarize();
        }
        return response;
    }

    async summarize(){
        let summaryportion = this.chathistory.slice(3, Math.ceil(this.chathistory.length/2.0));
            summaryportion.push({role: 'system', content: 'summarize this conversation in 1000 characters or less, make sure each topic discussed is represented'});
            const summary = await this.openai.chat.completions.create({
                messages: summaryportion,
                model: 'gpt-4-turbo-preview',
                temperature: 1.0,
                stream: false,
            });
            this.chathistory = [{ role: 'system', content: `your name is ${this.name}`},
                                { role: 'system', content: this.initialprompt},
                                { role: 'system', content: NO_RESPONSE_STRING},
                                { role: 'system', content: `here is a summary of the conversation so far: ${summary.choices[0].message.content}`}].concat(this.chathistory.slice(Math.ceil(this.chathistory.length/2.0) + 1, this.chathistory.length));
            //let fullchathistory = '';
            //this.chathistory.forEach((msg) => fullchathistory += msg.content);
    }

    async setPrompt(newprompt){
        console.log(`setting prompt \"${newprompt}\"`);
        if(typeof newprompt == "string"){
            this.chathistory[INITIAL_PROMPT_INDEX] = {role: 'system', content: newprompt};
            this.initialprompt = newprompt;
        } else if(newprompt === 0){
            this.chathistory[INITIAL_PROMPT_INDEX] = {role: 'system', content: dataController.appdata.default_prompt};
            this.initialprompt = dataController.appdata.default_prompt;
        } else
            console.log('attempted to set non-string prompt');
    }

    async setName(newname){
        console.log(`setting name \"${newname}\"`);
        if(typeof newname == "string"){
            this.chathistory[NAME_INDEX] = {role: 'system', content: `your name is ${newname}`};
            this.name = newname;
        } else if(newname === 0){
            this.chathistory[NAME_INDEX] = {role: 'system', content: dataController.appdata.default_name};
            this.name = dataController.appdata.default_name;
        } else
            console.log('attempted to set non-string name');
    }
}