const Remainder = require("../models/Remainder");
const User = require("../models/User");
const { Email } = require("../Services/Email");
const { getRemainderhtml } = require("../Services/getEmailHtml");

async function sendRemainder(id) {
    try {
        if( !id ){
            return;
        }
        let rem = await Remainder.findById(id);
        let user = await User.findById(rem.userId);
        let emailHtml = getRemainderhtml(user.name, rem.title, rem.content);
        Email(
            [user.email],
            [],
            rem.title,
            '',
            emailHtml
        ).then(async () => {
            // resolve({msg: 'Remainder sent'});
        })
        .catch((err) => {
            console.log("Err***", err);
            // reject({error: 'Error sending remainder mail'});
        })
    } catch (error) {
        console.log(error);
        reject({error: 'Internal server error occured'});
    }
}

module.exports = {
    sendRemainder,
}