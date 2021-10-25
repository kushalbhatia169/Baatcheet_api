checkAuthentication = async(req) => {
  // check for basic auth header
  //console.log(req.headers.authorization)
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    // return res.status(401).json({ message: 'Missing Authorization Header' });
    return false;
  }
  
  // verify auth credentials
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  // console.log(username, password);
  return [username, password];
}

module.exports = checkAuthentication;