const uuid = require("uuid"),

  secret = () => {

    const JWT_SECRET = uuid.v4();
    return JWT_SECRET;

  };

module.exports = secret;
