const express = require('express');
const app = express();

const path = require('path');

app.set('view engine','pug');
app.set('views', path.join(__dirname, '../src'));

app.get('/', (req,res) => {

    let range = [];
    for(let i = 0; i < 10; ++i)
        range.push(i);

    res.render('app', {table : range});

});

app.listen(2222, () => {
    console.log('Online');
});