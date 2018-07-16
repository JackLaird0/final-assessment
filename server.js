const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);



app.listen(app.get('port'), () => {
  console.log(`Mars Bars is running on ${app.get('port')}`)
})