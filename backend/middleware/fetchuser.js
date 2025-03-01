var jwt = require('jsonwebtoken');
const UserHistory = require('../models/UserHistory');
const JWT_SCERET = process.env.JWT_SCERET;

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token and append id to req object
    const token = req.cookies.authToken;
    if(!token){
        res.status(401).send({error: 'Pleaze authenticate using valid token'});
        return;
    }

    try{
        const data = jwt.verify(token, JWT_SCERET);
        req.user = data.user;
        next(); // used to call next present function after call to this fetchuser function
    }
    catch(err) {
        if(err.message === 'jwt expired') {
            const user = jwt.decode(token);
            UserHistory.create({
                userId: user.id,
                action: "Session expired",
            });
            res.clearCookie('authToken');
            res.status(401).send({ sessionexpired: true, error: 'Session expired please login again', navigate: '/login'});
        } else {
            res.status(401).send({error: 'Pleaze authenticate using valid token'});
        }
    }
}

module.exports = fetchuser;