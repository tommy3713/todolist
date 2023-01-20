import express from 'express';
import  { Request, Response, Application } from 'express';
import * as t from 'io-ts'
import { identity, pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import YAML from 'yamljs';



const app: Application = express();
const PORT = 8000;
const swaggerJSDocs = YAML.load("api/api-doc.yaml");

app.use(bodyParser.json())
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDocs));

const Todo = t.type({
    id: t.string,
    taskName: t.string,
    status: t.string
});
type Todo = t.TypeOf<typeof Todo>;
let todos: Todo[] = [];
// RESTful todo list api
// GET
app.get("/api/todos", (req: Request, res: Response) => {
    res.status(200).send(todos)
});
// POST
app.post("/api/todos", (req: Request, res: Response): void =>{
    const newTodo = req.body;
    pipe(
        Todo.decode(newTodo),
        E.match(
            errors => res.status(400).json({ errors }),
            validTodo => {
                todos.push(validTodo)
                return res.status(200).send(validTodo)
            }
        )
    )
});
// PUT
app.put("/api/todos/:id", (req: Request, res: Response): void => {
    const id = req.params.id;
    const updatedTodo = req.body
    const updateTodo = (validId: string) => (validTodo: Todo) => {
        const index = todos.findIndex(todo => todo.id === id)
        todos[index] = validTodo
        return res.status(200).send(JSON.stringify(validTodo));
    }
    pipe(
        E.of(updateTodo),
        E.ap((t.string).decode(id)),
        E.ap(Todo.decode(updatedTodo))
    )
});
// DELETE
app.delete('/api/todos/:id', (req: Request, res: Response) => {
    const decoded = t.type({ id: t.string }).decode(req.params);
    pipe(
        decoded, 
        E.match(
            errors => res.status(400).json({ errors }),
            ({id}) => {
                const index = todos.findIndex(todo => todo.id === id)
                todos.splice(index,1)
                return res.status(200).json(id)
            }
        )
    );
});


app.get("/", (req: Request, res: Response): void => {
    res.send("Hello Typescript!! TESTING");
});
app.listen(PORT, (): void => {
console.log(`Server Running here  https://localhost:${PORT}`);
});

