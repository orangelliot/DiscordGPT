const Conversation = require('./conversation')

module.exports = class ConversationManager{

    constructor(){
        this.activeconvos = new Object();
    }

    async request(message){
        if(!this.hasActiveConvo(message.channel.id)){
            this.activeconvos[message.channel.id] = new Conversation();
        }
        this.activeconvos[`${message.channel.id}.timestamp`] = Date.now();
        return await this.activeconvos[message.channel.id].request(message);
    }

    cleanupInactiveConvos(){
        const timenow = Date.now();
        for (const [key, value] of Object.entries(this.activeconvos)){
            console.log(`checking kv pair: ${key}, ${value}`);
            if(key.includes('timestamp') && (timenow - value) > 120000){
                delete this.activeconvos[key];
                delete this.activeconvos[key.split('.')[0]]
                console.log(`timed out conversation in ${key}`);
            }
        }
    }

    hasActiveConvo(channelid){
        return this.activeconvos[channelid];
    }
}