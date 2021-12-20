const mongoose = require('mongoose')
const dbconfig = require('../db/db.config');
const uri = process.env.MONGODB_URI;
mongoose
  .connect( uri || dbconfig.DBAddress, {...dbconfig.DBPARAMS})
  .then(() => console.log('connection successfull'))
  .catch(e => {
    console.error('Connection error', e.message)
  })

const db = mongoose.connection
module.exports = db;