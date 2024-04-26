
module.exports = class ResponseHandler{

    responsestream = [];
    chunkbuffer = '';
    noresponse = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;

    async sendResponse(response, channel) {
        channel.sendTyping();
        let incode = false;
        for await (const chunk of response) {
            const chunkcontent = chunk.choices[0].delta.content || '';
            this.chunkbuffer += chunkcontent;
            const newline = this.chunkbuffer.indexOf('\n');
            let codeblock = -1
            if(incode)
                codeblock = this.chunkbuffer.slice(2).split('').reverse().join('').search(/```/);
            else
                codeblock = this.chunkbuffer.search(/```/);
            if(codeblock > -1){
                if(incode){
                    const tosend = this.chunkbuffer.slice(0, this.chunkbuffer.length - codeblock);
                    this.chunkbuffer = this.chunkbuffer.slice(this.chunkbuffer.length - codeblock);
                    if(!tosend.match(this.noresponse) && tosend.length > 0){
                        try {
                            await channel.send(tosend);
                            channel.sendTyping();
                        } catch (error) {
                            console.log(`error while attempting to send: ${tosend}`);
                        }
                    }
                    this.responsestream.push(tosend);
                }
                else{
                    const tosend = this.chunkbuffer.slice(0, codeblock);
                    this.chunkbuffer = this.chunkbuffer.slice(codeblock);
                    if(!tosend.match(this.noresponse) && tosend.length > 0){
                        try {
                            await channel.send(tosend);
                            channel.sendTyping();
                        } catch (error) {
                            console.log(`error while attempting to send: ${tosend}`);
                        }
                    }
                    this.responsestream.push(tosend);
                }
                incode = !incode;
            }
            if(!incode && newline != -1){
                const tosend = this.chunkbuffer.slice(0, newline + 1);
                this.chunkbuffer = this.chunkbuffer.slice(newline + 1);
                if(!tosend.match(this.noresponse))
                try {
                    await channel.send(tosend);
                    channel.sendTyping();
                } catch (error) {
                    console.log(`error while attempting to send: ${tosend}`);
                }
                this.responsestream.push(tosend);
            }
        }
        if(this.chunkbuffer.length > 0){
            if(!this.chunkbuffer.match(this.noresponse)){
                try {
                    await channel.send(this.chunkbuffer);
                } catch (error) {
                    console.log(`error while attempting to send: ${tosend}`)
                }
            }
            this.responsestream.push(this.chunkbuffer);
            this.chunkbuffer = '';
        }
        response = this.responsestream.join('');
        return response;
    }
}