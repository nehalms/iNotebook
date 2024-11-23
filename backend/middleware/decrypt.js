const { decryptedMsg } = require('../Services/Crypto');

const decrypt = (req, res, next) => {
    try{
        if( !req.body || !Object.keys(req.body).length ) {
            next();
            return;
        }
        let body = req.body;
        Object.keys(body).forEach((key) => {
            req.body[key] = decryptedMsg(body[key]);
        })
        next();
    }
    catch(err){
        console.log('Error***', err);
        res.status(500).send("Internal server error");
    }
}

module.exports = decrypt;