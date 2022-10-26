const express = require('express');
const app = express();

const port = 5050;

app.use(express.static('public'));

const router = require('./controller/router');

/* app.set('views', __dirname + '/views');  */
/* app.set('view engine', 'pug');  */
app.set('view engine', 'ejs');

app.use('/', router)

app.listen(port, ()=>{console.log(`Server started on port: ${port}`)});
