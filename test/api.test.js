const { expect } = require('chai');
const supertest = require('supertest');

const api = supertest('http://localhost:8000/api/todos');
describe('Test for GET api', () => {
    it('Should return with status 200', (done) => {
      api.get('/')
          .set('Content-type', 'application/json')
          .expect(200)
          .end((err, res) => {
              if(err) done(err)
              done()
          });
    });
  });
describe('Test for POST api', () => {
  it('Post should return an object with status 200', (done) => {
    api.post('/')
        .set('Content-type', 'application/json')
        .send({id:"1", taskName:"do hw", status: "Complete"}) 
        .expect(200)
        .end((err, res) => {
            if(err) done(err)
            expect(res.body.id).to.be.eql("1");
            expect(res.body.taskName).to.be.eql("do hw");
            expect(res.body.status).to.be.eql("Complete");
            done()
        });
  });
});
describe('Test for PUT api', () => {
    it('PUT should return an object with status 200', (done) => {
      api.put('/1')
          .set('Content-type', 'application/json')
          .send({id:"1", taskName:"modified", status: "Complete"}) 
          .expect(200)
          .end((err, res) => {
              if(err) done(err)
              expect(res.body.id).to.be.eql("1");
              expect(res.body.taskName).to.be.eql("modified");
              expect(res.body.status).to.be.eql("Complete");
              done()
          });
    });
});
describe('Test for DELETE api', () => {
    it('DELETE should return an object with status 200', (done) => {
      api.delete('/1')
          .set('Content-type', 'application/json') 
          .expect(200)
          .end((err, res) => {
              if(err) done(err)
              done()
          });
    });
});