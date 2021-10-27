const crypto = require('crypto');

setPassword = async(password) =>{
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return {
    salt,
    hash,
  }
}; 
  
validateHashPassword = async(password, salt, user_hash) =>{ 
// console.log(password, salt, user_hash)
  if(!password || !salt ||  !user_hash){
    return false;
  } 
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return user_hash === hash;
};



module.exports = {
  setPassword,
  validateHashPassword
};