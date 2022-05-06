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

router.get('/kmeans/pretest', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();

    if(progress[0]){
        return res.redirect('/lessons/kmeans');
    }

    res.render('kmeans1/preassessment.ejs');
})

router.get('/kmeans/introduction', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();
    
    if(! progress[0] || progress[1]){
        return res.redirect('/lessons/kmeans');
    }
    
    res.render('kmeans1/introduction.ejs');
})

router.get('/kmeans/algorithm', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();

    if(! progress[1] || progress[2]){
        return res.redirect('/lessons/kmeans');
    }

    if(req.user.treatment){
        res.render('kmeans2/algorithm.ejs');
    }else{
        res.render('kmeans1/algorithm.ejs');
    }
})

router.get('/kmeans/example', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();

    if(! progress[2] || progress[3]){
        return res.redirect('/lessons/kmeans');
    }

    if(req.user.treatment){
        res.render('kmeans2/example.ejs');
    }else{
        res.render('kmeans1/example.ejs');
    }
})

router.get('/kmeans/posttest', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();

    if(! progress[3] || progress[4]){
        return res.redirect('/lessons/kmeans');
    }

    res.render('kmeans1/postassessment.ejs');
})

router.get('/kmeans/feedback', async (req,res) => {
    const progress = await Progress.find({'id': req.user.id}, (err,docs)=>{return(docs)}).clone();

    if(! progress[4] || progress[5]){
        return res.redirect('/lessons/kmeans');
    }

    res.render('kmeans1/feedback.ejs');
})

module.exports = router;