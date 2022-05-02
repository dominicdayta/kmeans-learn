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

router.get('/kmeans/algorithm', (req,res) => {
    res.render('kmeans1/algorithm.ejs');
})

router.get('/kmeans/example', (req,res) => {
    res.render('kmeans1/example.ejs');
})

router.get('/kmeans/posttest', (req,res) => {
    res.render('kmeans1/postassessment.ejs');
})

router.get('/kmeans/feedback', (req,res) => {
    res.render('kmeans1/feedback.ejs');
})

module.exports = router;