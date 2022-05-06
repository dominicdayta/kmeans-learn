const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Assessment = require('../models/assessment');
const Progress = require('../models/progress');
mongoose.connect(process.env['DATABASE_URL2'], { useNewUrlParser: true });
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

router.post('/kmeans/introduction', async (req,res) => {
    
    const thisProgress = new Progress({
        'id': req.user.id, 
        'lesson': 'introduction',
        'dateCompleted': Date.now().toString()
    });

    await thisProgress.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Lesson 1 : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    return res.redirect('/lessons/kmeans/algorithm');
})

router.post('/kmeans/algorithm', async (req,res) => {
    
    const thisProgress = new Progress({
        'id': req.user.id, 
        'lesson': 'algorithm',
        'dateCompleted': Date.now().toString()
    });

    await thisProgress.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Lesson 2 : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    return res.redirect('/lessons/kmeans/example');
})

router.post('/kmeans/example', async (req,res) => {
    
    const thisProgress = new Progress({
        'id': req.user.id, 
        'lesson': 'example',
        'dateCompleted': Date.now().toString()
    });

    await thisProgress.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Lesson 3 : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    return res.redirect('/lessons/kmeans/posttest');
})

router.post('/kmeans/pretest', async (req,res) => {

    const thisProgress = new Progress({
        'id': req.user.id, 
        'lesson': 'pretest',
        'dateCompleted': Date.now().toString()
    });

    const thisAssessment = new Assessment({
        'id': req.user.id, 
        'type': 'pretest',
        'answers':
            [
                req.body.item1,
                req.body.item2,
                req.body.item3,
                req.body.item4,
                req.body.item5,
                req.body.item6,
                req.body.item7,
                req.body.item8,
                req.body.item9,
                req.body.item10,
                req.body.item11,
                req.body.item12,
                req.body.item13,
                req.body.item14,
                req.body.item15
            ]
    });
    
    await thisAssessment.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Pre-Test Answers : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    await thisProgress.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Pre-Test Progress : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    return res.redirect('/lessons/kmeans/introduction');
})

router.post('/kmeans/posttest', async (req,res) => {

    const thisProgress = new Progress({
        'id': req.user.id, 
        'lesson': 'posttest',
        'dateCompleted': Date.now().toString()
    });

    const thisAssessment = new Assessment({
        'id': req.user.id, 
        'type': 'posttest',
        'answers':
            [
                req.body.item1,
                req.body.item2,
                req.body.item3,
                req.body.item4,
                req.body.item5,
                req.body.item6,
                req.body.item7,
                req.body.item8,
                req.body.item9,
                req.body.item10,
                req.body.item11,
                req.body.item12,
                req.body.item13,
                req.body.item14,
                req.body.item15
            ]
    });
    
    await thisAssessment.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Post-Test Answers : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    await thisProgress.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Post-Test Progress : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    return res.redirect('/lessons/kmeans/feedback');
})

router.post('/kmeans/feedback', async (req,res) => {

    const thisProgress = new Progress({
        'id': req.user.id, 
        'lesson': 'feedback',
        'dateCompleted': Date.now().toString()
    });

    const thisAssessment = new Assessment({
        'id': req.user.id, 
        'type': 'feedback',
        'answers':
            [
                req.body.item1,
                req.body.item2,
                req.body.item3,
                encodeURI(req.body.item4),
                req.body.item5
            ]
    });
    
    await thisAssessment.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Feedback Answers : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    await thisProgress.save((err, doc) => {
        if (err){
            console.log('Error during record insertion, student ' + req.user.id + ' on Feedback Progress : ' + err);
            return res.redirect('/lessons/kmeans');
        }
            
    });

    return res.redirect('/lessons/kmeans/');
})

module.exports = router;