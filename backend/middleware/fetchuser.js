var jwt = require('jsonwebtoken');
const JWT_SCERET = "Nehal_@token!";

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token and append id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: 'Pleaze authenticate using valid token'});
    }

    try{
        const data = jwt.verify(token, JWT_SCERET);
        req.user = data.user;
        next(); // used to call next present function after call to this fetchuser function
    }
    catch(err){
        res.status(401).send({error: 'Pleaze authenticate using valid token'});
    }
}

module.exports = fetchuser;