const mongoose = require('mongoose')
const dbconfig = require('../db/db.config');
mongoose
  .connect(`${dbconfig.DBSERVICE}://${dbconfig.DBPORT}/${dbconfig.DBNAME}`, {...dbconfig.DBPARAMS,
  useFindAndModify: false})
  .catch(e => {
    console.error('Connection error', e.message)
  })

const db = mongoose.connection
module.exports = db;