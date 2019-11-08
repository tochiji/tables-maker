const express = require('express');
const app = express();
// const path = require('path');

// app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('build'));
const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('server start');
});

app.get('*', function(req, res) {
    res.redirect('/');
});