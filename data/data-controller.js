const fs = require('fs');
const path = require('path');

module.exports = {
    appdata: JSON.parse(fs.readFileSync(path.resolve(__dirname, './appdata.json'))),
    write_data(){
        fs.writeFileSync(path.resolve(__dirname, './appdata.json'), JSON.stringify(this.appdata))
    }
}