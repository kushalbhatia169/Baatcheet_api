const crypto = require('crypto');

class HashPassword {

  async setPassword(password){
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {
      salt,
      hash,
    }
  }; 
  
  async validateHashPassword(password, salt, user_hash){ 
  //console.log(password, salt, user_hash)
    if(!password){
      return false;
    } 
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return user_hash === hash;
  };
}



module.export = HashPassword;