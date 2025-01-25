const Remainder = require("../models/Remainder");
const cron = require('node-cron');
const User = require("../models/User");
const { getRemainderhtml } = require("./getEmailHtml");
const { Email } = require('../Services/Email');

async function getReaminders(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let userId = req.user.id;
            let remainder = await Remainder.find({userId: userId})
            resolve(remainder);
        } catch (error) {
            console.log(error);
            reject({error: 'Internal server error occured'});
        }
    });
}

async function setRemainder(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let body = req.body;
            if(!body.title || !body.content || !body.date) {
                reject({error: 'Missing body parameters'});
                return;
            }
            let userId = req.user.id;
            let dateTime = new Date(body.date);
            // let cronExpression =  {
            //     seconds: dateTime.getSeconds(),
            //     minutes: dateTime.getMinutes(),
            //     hours: dateTime.getHours(),
            //     dateOfMonth: dateTime.getDate(),
            //     month: dateTime.getMonth() + 1
            // }
            let cronExpression =  {
                seconds: dateTime.getUTCSeconds(),
                minutes: dateTime.getUTCMinutes(),
                hours: dateTime.getUTCHours(),
                dateOfMonth: dateTime.getUTCDate(),
                month: dateTime.getUTCMonth() + 1
            }
            let cronExp = `${cronExpression.seconds} ${cronExpression.minutes} ${cronExpression.hours} ${cronExpression.dateOfMonth} ${cronExpression.month} *`;
            let remainder = await Remainder.create({
                userId: userId,
                title: body.title,
                content: body.content,
                remainderDate: dateTime,
                cronExp: cronExp,
                isComp: false
            });
            let validExp = cron.validate(cronExp);

            if(validExp) {
                console.log('Cron set at', cronExp, 'for', userId);
                cron.schedule(cronExp, async function() {
                    console.log(`Cron job for ${userId} started for ${remainder._id}`);                    
                    await Remainder.findByIdAndUpdate(remainder._id, {isComp: true}, {new: true});
                    let user = await User.findById(userId);
                    let emailHtml = getRemainderhtml(user.name, remainder.title, remainder.content);
                    console.log(emailHtml);
                    Email(
                        [user.email],
                        [],
                        remainder.title,
                        '',
                        emailHtml
                    ).then(() => {
                        console.log(`Remainder Completed for ${userId}`);
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    })
                }, { timezone: 'Asia/Kolkata' });
                resolve({status:1, msg: 'Remainder set successfully'});
            } else {
                reject({error: 'Error in setting remainder'});
            }

        } catch (error) {
            console.log(error);
            reject({error: 'Internal server error occured'});
        }
    });
}

async function deleteRemainder(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let remainder = await Remainder.findOneAndDelete(req.params.id);
            if(remainder && remainder.userId == req.user.id) {
                resolve({status: 1, msg: 'Remainder deleted successfully'});
            } else {
                resolve({status: 0, msg: 'No Remainder found with the given id'});
            }
        } catch (error) {
            console.log(error);
            reject({error: 'Internal server error occured'});
        }
    });
}

module.exports = {
    getReaminders,
    setRemainder,
    deleteRemainder
}