const express = require('express');
const app = express();

const path = require('path');

app.set('view engine','pug');
app.set('views', path.join(__dirname, '../src'));

app.get('/', (req,res) => {

    let left = req.query['from'];
    let right = req.query['to'];

    if(!left)
        left = 0;

    if(!right)
        right = parseInt(left) + 12;

    let range = [];
    for(let i = left; i <= right; ++i)
        range.push(i);

    res.render('app', {table : range});

});

app.listen(2222, () => {
    console.log('Online');
});