const fs = require('fs');
const path = require('node:path');

module.exports = {
    path: path.join(__dirname, 'appdata.json'),
    appdata: JSON.parse(fs.readFileSync(path.join(__dirname, 'appdata.json'))),

    writeData(){
        console.log('writing data')
        fs.writeFileSync(this.path, JSON.stringify(this.appdata))
    },

    readData(){
        console.log('reading data')
        this.appdata = JSON.parse(fs.readFileSync(this.path))
    },

    setPrompt(guildid, channelid, newprompt){
        if(typeof newprompt == "string"){
            this.appdata.guilds[guildid].channels[channelid].initial_prompt = newprompt;
            return newprompt;
        }
        if(newprompt === 0){
            this.appdata.guilds[guildid].channels[channelid].initial_prompt = this.appdata.default_prompt;
            return this.appdata.default_prompt;
        }
        throw new TypeError("new prompt must be 0 or of type string")
    },

    setName(guildid, channelid, newname){
        if(typeof newname == "string"){
            this.appdata.guilds[guildid].channels[channelid].name = newname;
            return newname;
        } 
        if(newname === 0){
            this.appdata.guilds[guildid].channels[channelid].name = this.appdata.default_name;
            return this.appdata.default_name;
        }
        throw new TypeError("new name must be 0 or of type string")
    },

    hasGuild(guildid){
        return this.appdata.guilds[guildid];
    },

    hasChannel(guildid, channelid){
        return this.appdata.guilds[guildid]?.channels[channelid];
    }
}