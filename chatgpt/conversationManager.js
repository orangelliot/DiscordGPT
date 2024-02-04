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
        return await this.activeconvos[message.channel.id].request(message.content);
    }
    cleanupInactiveConvos(){
        const timenow = Date.now();
        for (const [key, value] of Object.entries(this.activeconvos)){
            if(key.includes('timestamp') && (timenow - value) > 30000){
                delete this.activeconvos[key];
                console.log(`timed out conversation in ${key}`);
            }
        }
    }

    hasActiveConvo(channel){
        return this.activeconvos[channel];
    }
}