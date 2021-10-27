const jwt = require('jsonwebtoken');

module.exports.isAuthorized = (err, res, req, next) => {
    //will use dynamic secret it in production but not in development 
    //const secret = process.env['secret'];
    const token = req?.cookies?.jwt;
    if(!token) {
      return res.status(400).json({
        success: false,
        error:'no token found!',
      })
    }
    try {
      jwt.verify(token, '54ef8c4e-b8e7-4cf7-b4e5-35643f814fa6'/*secret*/);
      next();
    } catch (error) {
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
  }