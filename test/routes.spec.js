const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV = 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage when hitting the root endpoint', done => {
    chai.request(server)
      .get('/')
      .end((err, resp) => {
        resp.should.have.status(200);
        resp.should.be.html;
        done();
      });
  });

  it('should return a 404 status code for an endpoint that doesn\'t exist', done => {
    chai.request(server)
      .get('/fake')
      .end((err, resp) => {
        resp.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  beforeEach( done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return an array of item objects', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('array');
          resp.body[0].should.have.property('id');
          resp.body[0].id.should.equal(1);
          resp.body[0].should.have.property('name');
          resp.body[0].name.should.equal('item 1');
          resp.body[0].should.have.property('status');
          resp.body[0].status.should.equal(false);
          done();
        });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should create a new item', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          item: { name: 'test item', status: 'false' }
        })
        .end((err, resp) => {
          resp.should.have.status(201);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.id.should.equal(3);
          done();
        });
    });

    it('should return an error if the body is incorrect', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          item: {}
        })
        .end((err, resp) => {
          resp.should.have.status(422);
          resp.body.error.should.equal(`Expected format: { item: { name: <String>, status: <Boolean> }} You're missing a name property.`);
          done();
        });
    });
  });

  describe('PUT /api/v1/items/:id', () => {
    it('should return the item object with the updated data', done => {
      chai.request(server)
      .put('/api/v1/items/1')
      .send({
        item: { name: 'test item', status: true }
      })
      .end((err, resp) => {
        resp.should.have.status(201);
        resp.body.should.be.a('object');
        resp.body.should.have.property('name')
        resp.body.name.should.equal('test item')
        resp.body.should.have.property('status')
        resp.body.status.should.equal(true)
        resp.body.should.have.property('id')
        resp.body.id.should.equal('1')
        done();
      });
    });
  });
});