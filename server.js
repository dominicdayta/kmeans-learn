const express = require('express');
const app = express();
const lessonsRoutes = require('./routes/lessons.js');

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.use('/lessons',lessonsRoutes);

app.get('/', (req,res) => {
    res.render('index');
})

app.listen(4000);