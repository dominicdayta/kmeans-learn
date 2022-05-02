const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('lessons');
})

router.get('/kmeans', (req,res) => {
    res.render('kmeans-home');
})

router.get('/kmeans/pretest', (req,res) => {
    res.render('kmeans1/preassessment.ejs');
})

router.get('/kmeans/introduction', (req,res) => {
    res.render('kmeans1/introduction.ejs');
})

router.get('/kmeans/posttest', (req,res) => {
    res.render('kmeans1/postassessment.ejs');
})

module.exports = router;