require('dotenv').config({path: __dirname + '/.env'});

module.exports = {
    DBSERVICE: 'mongodb+srv',
    DBPORT: `${process.env.DBUser || 'kushal'}:${process.env.DBPassword || 'Kush8127'}@cluster0.hifeh.mongodb.net`,
    DBNAME: `${process.env.DBName || 'baatcheet'}?retryWrites=true&w=majority`,
    DBPARAMS: {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false,
    }
}
