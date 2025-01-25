const Remainder = require("../models/Remainder");
const cron = require('node-cron');
const User = require("../models/User");

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

            //Local time
            let cronExpression =  {
                seconds: dateTime.getSeconds(),
                minutes: dateTime.getMinutes(),
                hours: dateTime.getHours(),
                dateOfMonth: dateTime.getDate(),
                month: dateTime.getMonth() + 1
            }

            // //ServerTime
            // let cronExpression =  {
            //     seconds: dateTime.getUTCSeconds(),
            //     minutes: dateTime.getUTCMinutes(),
            //     hours: dateTime.getUTCHours(),
            //     dateOfMonth: dateTime.getUTCDate(),
            //     month: dateTime.getUTCMonth() + 1
            // }
            let cronExp = `${cronExpression.minutes} ${cronExpression.hours} ${cronExpression.dateOfMonth} ${cronExpression.month} *`;
            let validExp = cron.validate(cronExp);

            if(validExp) {
                console.log('Cron set at', cronExp, 'for', userId);
                await Remainder.create({
                    userId: userId,
                    title: body.title,
                    content: body.content,
                    remainderDate: dateTime,
                    cronExp: cronExp,
                    cronUrl: process.env.BASE_URL + '/cron/send-rem',
                    isComp: false
                });
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