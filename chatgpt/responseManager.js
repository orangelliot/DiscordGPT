
module.exports = class ResponseManager{
    responsestream = [];
    chunkbuffer = '';
    noresponseregex = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;
    async sendResponse(response, channel) {
        console.log('test');
        for await (const chunk of response) {
            const chunkcontent = chunk.choices[0].delta.content || '';
            this.chunkbuffer += chunkcontent;
            if(this.chunkbuffer.length > 200){
                const punctuation = /[.?!")\]]/;
                const endofsentence = this.chunkbuffer.length - this.chunkbuffer.split('').reverse().join('').search(punctuation);
                const tosend = this.chunkbuffer.slice(0, endofsentence);
                this.chunkbuffer = this.chunkbuffer.slice(endofsentence);

                if(!tosend.match(this.noresponseregex))
                    await channel.send(tosend);
                this.responsestream.push(tosend);
            }
            //if(chunk.choices[0].delta.content === '[DONE]'){
            //    if(this.chunkbuffer.length > 0){
            //        await channel.send(this.chunkbuffer);
            //        this.responsestream.push(this.chunkbuffer);
            //        this.chunkbuffer = '';
            //    }
            //    console.log('message finished');
            //}
            
            
                //if(!this.chunkbuffer.match(this.noresponseregex))
                //    await channel.send(this.chunkbuffer);
                //this.responsestream.push(this.chunkbuffer);
                //this.chunkbuffer = '';
        }
        if(this.chunkbuffer.length > 0){
            if(!this.chunkbuffer.match(this.noresponseregex))
                    await channel.send(this.chunkbuffer);
            this.responsestream.push(this.chunkbuffer);
            this.chunkbuffer = '';
        }
        response = this.responsestream.join('');
        return response;
    }
}