const jwt = require("jsonwebtoken");

const verifyToken = (req, res,next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if(!token){
        return res.status(403).send('Please Logged in!')
    }

    jwt.verify(token, process.env.JWTSECRETKEY, (err, decoded)=> {
        if(err) return res.status(403).send("You need to log in to add URLs.");

        req.user = decoded
        next()
    })
}



const verifyPost = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
        req.user = decoded;  // ✅ Now req.user is set before proceeding

    } catch (err) {
        console.error("JWT Error:", err.message);
        req.user = null;
    }
    next();
};



module.exports = {verifyToken, verifyPost};