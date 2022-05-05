const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Progress = require('../models/progress');
mongoose.connect(process.env['DATABASE_URL'], { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

checkProgress = (progressList) => {
    progressSwitch = [false, false, false, false, false, false];
    progressNames = ['pretest', 'introduction', 'algorithm', 'example', 'posttest', 'feedback'];

    for(i = 0; i < 6; i++){
        let thisProgress = progressList.find(milestone => milestone.lesson == progressNames[i]);
        if(thisProgress != undefined){
            let thisDate = new Date(parseInt(thisProgress.dateCompleted));
            progressSwitch[i] = ''.concat(thisDate.getDay(), '/', thisDate.getMonth() + 1, '/',thisDate.getFullYear());
        }
    }

    return(progressSwitch);
}

router.get('/', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();
    res.render('lessons', { user: req.user, progress: checkProgress(progress) });
})

router.get('/kmeans', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();
    res.render('kmeans-home', { user: req.user, progress: checkProgress(progress) });
})

router.get('/kmeans/pretest', (req,res) => {
    res.render('kmeans1/preassessment.ejs');
})

router.get('/kmeans/introduction', (req,res) => {
    res.render('kmeans1/introduction.ejs');
})

router.get('/kmeans/algorithm', (req,res) => {
    if(req.user.treatment){
        res.render('kmeans2/algorithm.ejs');
    }else{
        res.render('kmeans1/algorithm.ejs');
    }
})

router.get('/kmeans/example', (req,res) => {
    if(req.user.treatment){
        res.render('kmeans2/example.ejs');
    }else{
        res.render('kmeans1/example.ejs');
    }
})

router.get('/kmeans/posttest', (req,res) => {
    res.render('kmeans1/postassessment.ejs');
})

router.get('/kmeans/feedback', (req,res) => {
    res.render('kmeans1/feedback.ejs');
})

module.exports = router;