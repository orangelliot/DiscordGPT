const Conversation = require('./conversation.js')

module.exports = {
    activeconvos: {},

    async request(message){
        if(!this.hasActiveConvo(message.channel.id)){
            this.activeconvos[message.channel.id] = new Conversation(message.guild.id, message.channel.id);
        }
        this.activeconvos[`${message.channel.id}.timestamp`] = Date.now();
        return await this.activeconvos[message.channel.id].request(message);
    },

    cleanupInactiveConvos(){
        const timenow = Date.now();
        for (const [key, value] of Object.entries(this.activeconvos)){
            if(key.includes('timestamp') && (timenow - value) > 1200000){
                delete this.activeconvos[key];
                delete this.activeconvos[key.split('.')[0]]
                console.log(`timed out conversation in ${key}`);
            }
        }
    },

    hasActiveConvo(channelid){
        return this.activeconvos[channelid];
    }
}