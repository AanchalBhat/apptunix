const mongoose = require('mongoose')

module.exports = class DBManager {
    async connectToDatabase() {
        const uri = `mongodb://localhost:27017/mongo`;
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        mongoose.connect(uri, options)
            .then(res => {
                console.log('\x1b[34m',"Connection Established !!", uri);
            }).catch((error) => {
                console.log('\x1b[34m','Database connection failed !!', error.message)
            });
    }
}
