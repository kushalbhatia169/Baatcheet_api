const jwt = require('jsonwebtoken');

module.exports.isAuthorized = (req, res, next) => {
    //will use dynamic secret it in production but not in development 
    //const secret = process.env['secret'];
    const token = req?.headers?.cookies;
    // console.log(req?.cookies?.jwt)
    console.log(req?.headers?.cookies)
    if(!token) {
      return res.status(400).json({
        success: false,
        error:'no token found!',
      })
    }
    jwt.verify(token, '54ef8c4e-b8e7-4cf7-b4e5-35643f814fa6'/*secret*/, (error) => {
      if(error){
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({
            success: false,
            error:'invalid token!',
          })
        }
        return res.status(400).json({
          success: false,
          error:'unexpected error',
        })
      }
      next(); 
    });
  }

  module.exports.isAuthenticated = (req, res, next) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      res.status(401).json({ message: 'Missing Authorization Header' });
    }   
    // verify auth credentials
    try {
      const base64Credentials =  req.headers.authorization.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      req.username = username; 
      req.password = password;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error:'unexpected error',
      }) 
    }
  }


  // try {
  //   jwt.verify(token, '54ef8c4e-b8e7-4cf7-b4e5-35643f814fa6'/*secret*/);
  //   next();
  // } catch (error) {
  //     if (error instanceof jwt.JsonWebTokenError) {
  //       res.status(400).json({
  //         success: false,
  //         error:'invalid token!',
  //       })
  //     }
  //     return res.status(400).json({
  //       success: false,
  //       error:'unexpected error',
  //     }) 
  // }