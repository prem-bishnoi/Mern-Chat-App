const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

//If User is not logged in they can't go to chats
const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    // console.log(req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

        //decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //add user object to req object without password
        req.user = await User.findById(decoded.id).select("-password");
        // console.log(req.user)
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect }