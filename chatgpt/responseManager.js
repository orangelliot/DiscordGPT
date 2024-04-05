
module.exports = class ResponseManager{
    responsestream = [];
    chunkbuffer = '';
    noresponse = /[nN][oO][\s,.]*[rR][eE][sS][pP][oO][nN][sS][eE][,.]*/;
    punctuation = /[.?!")\]]/;
    async sendResponse(response, channel) {
        let incode = false
        for await (const chunk of response) {
            const chunkcontent = chunk.choices[0].delta.content || '';
            const initialbufferlength = this.chunkbuffer.length;
            this.chunkbuffer += chunkcontent;
            const codesegment = chunkcontent.search(/```/);
            if(codesegment > -1){
                if(incode){
                    const tosend = this.chunkbuffer.slice(0, initialbufferlength + codesegment + 2);
                    this.chunkbuffer = this.chunkbuffer.slice(initialbufferlength + codesegment + 2);
                    if(!tosend.match(this.noresponse) && tosend.length > 0)
                        await channel.send(tosend);
                    this.responsestream.push(tosend);
                    incode = !incode;
                }
                else{
                    const tosend = this.chunkbuffer.slice(0, initialbufferlength + codesegment);
                    this.chunkbuffer = this.chunkbuffer.slice(initialbufferlength + codesegment);
                    console.log(`attempting to send the message: ${tosend}`)
                    if(!tosend.match(this.noresponse) && tosend.length > 0)
                        await channel.send(tosend);
                    this.responsestream.push(tosend);
                }
            }
            if(incode){
                this.chunkbuffer += chunkcontent;
            }
            else if(this.chunkbuffer.length > 200){
                const endofsentence = this.chunkbuffer.length - this.chunkbuffer.split('').reverse().join('').search(this.punctuation);
                const tosend = this.chunkbuffer.slice(0, endofsentence);
                this.chunkbuffer = this.chunkbuffer.slice(endofsentence);
                if(!tosend.match(this.noresponse))
                    await channel.send(tosend);
                this.responsestream.push(tosend);
            }
        }
        if(this.chunkbuffer.length > 0){
            if(!this.chunkbuffer.match(this.noresponse))
                    await channel.send(this.chunkbuffer);
            this.responsestream.push(this.chunkbuffer);
            this.chunkbuffer = '';
        }
        response = this.responsestream.join('');
        return response;
    }
}