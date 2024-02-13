const fs = require('fs');

module.exports = {
    appdata: JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../appdata.json'))),
    async write_data(data){
        this.appdata = JSON.stringify(data)
        fs.writeFileSync(path.resolve(__dirname, '../appdata.json'), this.appdata)
    }
}