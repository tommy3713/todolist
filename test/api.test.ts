// import { expect } from 'chai'
import { describe, expect, it, assert, beforeAll, afterAll, assertType } from 'vitest'
import supertest from 'supertest'
import { server } from '@server'
import type { Todo } from '@server'
import * as TE from 'fp-ts/TaskEither'
import { pipe, identity } from 'fp-ts/function'

const request = supertest('http://localhost:8000/api/todos')
const expressServer = server

beforeAll(async () => {
  await pipe(
    expressServer.start(8000),
    TE.match((e) => assert.fail(e.message), identity)
  )()
})

afterAll(async () => {
  await pipe(
    expressServer.close(),
    TE.match((e) => assert.fail(e.message), identity)
  )()
})

describe('Test for GET api', () => {
  it('Should return with status 200', async () => {
    const response = await request.get('/').set('Content-type', 'application/json')

    expect(response.statusCode).toEqual(200)
  })
})

describe('Test for POST api', () => {
  it('Post should return an object with status 200', async () => {
    const response = await request
      .post('/')
      .set('Content-type', 'application/json')
      .send({ id: '1', taskName: 'do hw', status: 'Complete' })

    expect(response.statusCode).toEqual(200)
    assertType<Todo>(response.body)
    const todo: Todo = response.body satisfies Todo
    expect(todo.id).toEqual('1')
    expect(todo.status).toEqual('Complete')
    expect(todo.taskName).toEqual('do hw')
  })
})

// describe('Test for PUT api', () => {
//   it('PUT should return an object with status 200', (done) => {
//     request
//       .put('/1')
//       .set('Content-type', 'application/json')
//       .send({ id: '1', taskName: 'modified', status: 'Complete' })
//       .expect(200)
//       .end((err, res) => {
//         if (err) done(err)
//         expect(res.body.id).to.be.eql('1')
//         expect(res.body.taskName).to.be.eql('modified')
//         expect(res.body.status).to.be.eql('Complete')
//         done()
//       })
//   })
// })

// describe('Test for DELETE api', async () => {
//   it('DELETE should return an object with status 200', (done) => {
//     request
//       .delete('/1')
//       .set('Content-type', 'application/json')
//       .expect(200)
//       .end((err, res) => {
//         if (err) done(err)
//         done()
//       })
//   })
// })
