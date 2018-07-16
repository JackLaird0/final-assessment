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
        })
    })
  });
});