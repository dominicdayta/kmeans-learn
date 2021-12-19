const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('lessons');
})

router.get('/kmeans', (req,res) => {
    res.render('kmeans-home');
})


module.exports = router;