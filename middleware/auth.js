const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({msg: "No token, authorization denied"});
    }

    try {
         const decode = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decode.user;
         
         next();
    } 
    
    catch (err) {
        res.status(401).json({msg: "Token in not valid"});
    }
}

module.exports = auth;