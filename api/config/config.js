const uuid = require('uuid');

const secret = () =>{
    const JWT_SECRET = uuid.v4();   
    return JWT_SECRET;
}

module.exports = secret;