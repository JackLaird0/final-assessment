const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', process.env.PORT || 3050);

app.get('/api/v1/items', (req, resp) => {
  database('items').select()
    .then( items => {
      resp.status(200).json(items)
    })
    .catch( error => {
      resp.status(500).json({ error })
    });
});

app.post('/api/v1/items', (req, resp) => {
  const { item  } = req.body;

  for(let requiredParam of ['name', 'status']) {
    if(!item[requiredParam]) {
      return resp.status(422)
        .send({ error: `Expected format: { item: { name: <String>, status: <Boolean> }} You\'re missing a ${requiredParam} property.`})
    }
  }

  database('items').insert(item, 'id')
    .then(item => {
      resp.status(201).json({ id: item[0]})
    })
    .catch(error => {
      resp.status(500).json({ error })
    });
});

app.put('/api/v1/items/:id', (req, resp) => {
  const { id } = req.params;
  const { item } = req.body;

  for(let requiredParam of ['name', 'status']) {
    if(!item[requiredParam]) {
      return resp.status(422)
        .send({ error: `Expected format: { item: { name: <String>, status: <Boolean> }} You\'re missing a ${requiredParam} property.`})
    }
  }

  const {name, status} = item;
  database('items').where('id', id)
    .update({
      name,
      status
    })
    .then(() => {
      resp.status(201).json({...item, id})
    })
    .catch( error => {
      resp.status(500).json({ error })
    })
});

app.delete('/api/v1/items/:id', (req, resp) => {
  const { id } = req.params;

  database('items').where('id', id).del()
    .then(() => {
      resp.status(202).json({ id})
    })
    .catch( error => {
      resp.status(404).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`Mars Bars is running on ${app.get('port')}`);
})

module.exports = app;