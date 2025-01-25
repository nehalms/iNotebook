const cronParser = require('cron-parser');
const axios = require('axios');
const Remainder = require("../models/Remainder");
const mongoose = require('mongoose');
const { sendRemainder } = require('../Cron/cronJobs');

async function remainderCron() {
    try {
        const now = new Date();
        const activeJobs = await Remainder.find({ isComp: false });
        for (const job of activeJobs) {
            const { cronExp, _id, userId } = job;

            const interval = cronParser.parseExpression(cronExp);
            const cronTime = interval.next().toDate();

            console.log(now.toISOString());
            console.log(cronTime.toISOString());
            console.log(now >= cronTime)

            if (now >= cronTime || cronTime - now <= 60 * 1000) {
                console.log(`Executing job with id ${_id} for user ${userId} at ${now}`);
                try {
                    await sendRemainder(_id);
                    await Remainder.findByIdAndUpdate(_id, { isComp: true });
                    console.log(`Job ${_id} executed successfully!`);
                } catch (err) {
                    console.error(`Error executing job ${_id}:`, err.message);
                }
            }
        }
    } catch (error) {
        console.error('Error checking cron jobs:', error);
    }
}

module.exports = remainderCron;