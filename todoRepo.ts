// insert
// update - upsert
// delete
import * as t from 'io-ts'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import * as AD from 'fp-ts-std/Array'
import * as T from 'fp-ts/Tuple'
import * as TD from 'fp-ts-std/Tuple'
import * as EQ from 'fp-ts/Eq'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

export const Todo = t.type({
  id: t.string,
  taskName: t.string,
  status: t.string,
})
export type Todo = t.TypeOf<typeof Todo>

const TodoEq: EQ.Eq<Todo> = {
  equals: (x: Todo, y: Todo) => S.Eq.equals(x.id, y.id) && S.Eq.equals(x.status, y.status) && S.Eq.equals(x.taskName, y.taskName),
}
const TodoIdEq: EQ.Eq<Todo> = { equals: (x: Todo, y: Todo) => S.Eq.equals(x.id, y.id) }

export type InsertError = { _tag: 'InsertError'; msg: string }
export type UpdateError = { _tag: 'UpdateError'; msg: string }
export type DeleteError = { _tag: 'DeleteError'; msg: string }
export type FindAllError = { _tag: 'FindAllError'; msg: string }
export type TodoRepoError = InsertError | UpdateError | DeleteError | FindAllError

const updateErrorOf: (msg: string) => UpdateError = (msg) => ({ _tag: 'UpdateError', msg })
const deleteErrorOf: (msg: string) => DeleteError = (msg) => ({ _tag: 'DeleteError', msg })
const findAllErrorOf: (msg: string) => FindAllError = (msg) => ({ _tag: 'FindAllError', msg })

export type TodoRepo = {
  insert: (v: Todo) => TE.TaskEither<InsertError, Todo>
  update: (v: Todo) => TE.TaskEither<UpdateError, Todo>
  delete: (id: string) => TE.TaskEither<DeleteError, Todo>
  all: () => TE.TaskEither<FindAllError, Array<Todo>>
}

export const todoRepoOf: () => TodoRepo = () => {
  let store = A.zero<Todo>()

  return {
    all: () =>
      pipe(
        store,
        TE.fromPredicate(
          (x) => x.length !== 0,
          (_) => findAllErrorOf('No todo')
        )
      ),
    insert: (v) =>
      TE.of(
        pipe(store, AD.upsert(TodoEq)(v), (x) => {
          store = x

          return v
        })
      ),
    update: (v) =>
      pipe(
        store,
        A.findIndex((x) => TodoIdEq.equals(x, v)),
        O.chain((x) => pipe(store, A.updateAt(x, v))),
        O.map((x) => {
          store = x

          return v
        }),
        TE.fromOption(() => updateErrorOf(`Todo: ${JSON.stringify(v)} cannot be found, failed to update`))
      ),
    delete: (id) =>
      pipe(
        store,
        A.findIndex((x) => S.Eq.equals(x.id, id)),
        O.map((i) => TD.create([i, store[i]])),
        O.chain((x) =>
          pipe(store, A.deleteAt(T.fst(x)), (todosO) =>
            pipe(
              todosO,
              O.map((todos) => TD.create([todos, T.snd(x)]))
            )
          )
        ),
        O.map((x) => {
          store = T.fst(x)

          return T.snd(x)
        }),
        TE.fromOption(() => deleteErrorOf(`Todo: ID ${id} cannot be found, failed to delete}`))
      ),
  }
}
