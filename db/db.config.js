require('dotenv').config({path: __dirname + '/.env'});

module.exports = {
    DBSERVICE: 'mongodb+srv',
    DBAddress: 'mongodb+srv://kushal:Kush8127@cluster0.hifeh.mongodb.net/baatcheet?retryWrites=true&w=majority',
    DBPARAMS: {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false,
    }
}
