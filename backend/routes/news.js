const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const checkPermission = require('../middleware/checkPermission')
const router = express.Router()
const axios = require("axios");
const scope = 'news';

const API_KEYS = [
    process.env.NEWS_API_KEY_1,    
    process.env.NEWS_API_KEY_2,
    process.env.NEWS_API_KEY_3,    
];

let keyIndex = 0;

router.get('/top', fetchuser, checkPermission(scope), async (req, res) => {
    try {
        const apiKey = API_KEYS[keyIndex];
        keyIndex = (keyIndex + 1) % API_KEYS.length;
        let country = req.query.country || 'in';
        let category = req.query.category || 'top';
        let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&category=${category}&language=en`
        let page = req.query.page;
        if(page && page != '') {
            url += `&page=${page}`;
        }
        axios.get(url)
            .then((response) => {
                res.send({
                    status: 1,
                    data: response.data,
                });
            })
            .catch(error => {
                console.error("Error in fetching news:", error.message);
                res.status(500).send('Internal Server Error');
            });
    } catch (err) {
        console.log("Error(news/top)***", err.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router