import { describe, expect, it, assert, beforeAll, afterAll, assertType } from 'vitest'
import supertest from 'supertest'
import { server } from '@server'
import type { Todo } from '@todoRepo'
import * as TE from 'fp-ts/TaskEither'
import * as I from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as OT from 'fp-ts/OptionT'
import { Predicate } from 'fp-ts/Predicate'
import * as E from 'fp-ts-std/Env'
import { pipe, identity } from 'fp-ts/function'
import { isPositiveInteger } from 'newtype-ts/lib/PositiveInteger'
import * as dotenv from 'dotenv'

dotenv.config()
const verifyPortAsInt: Predicate<number> = (v) => !isNaN(v) && isPositiveInteger(v)
const convertStr2Int: (v: string) => O.Option<number> = (v) => pipe(Number(v), O.fromPredicate(verifyPortAsInt))
const readPortFromEnv: () => O.Option<number> = () => pipe(E.getParam('PORT'), OT.chainOptionK(I.Monad)(convertStr2Int))()

const port = readPortFromEnv()

if (O.isNone(port)) assert.fail('Please configure TCP port for testing')

const request = supertest(`http://localhost:${O.getOrElse(() => 8000)(port)}/api/todos`)
const expressServer = server

beforeAll(async () => {
  await pipe(
    expressServer.start(O.getOrElse(() => 8000)(port)),
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

    expect(response.statusCode).toEqual(404)
  })
})

describe('Test for POST api', () => {
  it('Post should return an object with status 200', async () => {
    const response = await request
      .post('/')
      .set('Content-type', 'application/json')
      .send({ id: '1', taskName: 'do hw', status: 'Complete' })

    expect(response.statusCode).toEqual(201)
    assertType<Todo>(response.body)
    const todo: Todo = response.body satisfies Todo
    expect(todo.id).toEqual('1')
    expect(todo.status).toEqual('Complete')
    expect(todo.taskName).toEqual('do hw')
  })
})

describe('Test for PUT api', () => {
  it('PUT should return an object with status 200', async () => {
    const response = await request
      .put('/1')
      .set('Content-type', 'application/json')
      .send({ id: '1', taskName: 'modified', status: 'Complete' })

    expect(response.statusCode).toEqual(200)
    const body = response.body
    expect(body).not.toBeNull()
    expect(body).not.toBeUndefined
    assertType<Todo>(body)
    expect(body.id).toEqual('1')
    expect(body.taskName).toEqual('modified')
    expect(body.status).toEqual('Complete')
  })
})

describe('Test for DELETE api', async () => {
  it('DELETE should return an object with status 200', async () => {
    const response = await request.delete('/1').set('Content-type', 'application/json')

    expect(response.statusCode).toEqual(200)
    assertType<Todo>(response.body)

    const todo: Todo = response.body
    expect(todo.id).toEqual('1')
    expect(todo.taskName).toEqual('modified')
    expect(todo.status).toEqual('Complete')
  })
})
