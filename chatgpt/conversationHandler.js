const Conversation = require('./conversation')

module.exports = class ConversationHandler{
    constructor(){
        this.activeuserconvos = new Object();
    }
    async request(message){
        if(!this.hasActiveConvo(message.author.id)){
            this.activeuserconvos[message.author.id] = new Conversation();
        }
        this.activeuserconvos[`${message.author.id}.timestamp`] = Date.now();
        return await this.activeuserconvos[message.author.id].request(message.content);
    }
    cleanupInactiveConvos(){
        const timenow = Date.now();
        for (const [key, value] of Object.entries(this.activeuserconvos)){
            if(key.includes('timestamp') && (timenow - value / 1000) > 10){
                delete this.activeuserconvos[key];
            }
        }
    }
    hasActiveConvo(user){
        return user in this.activeuserconvos;
    }
}