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

});