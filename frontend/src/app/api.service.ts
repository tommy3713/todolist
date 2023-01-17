import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Todo } from './todos/todos'

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'content-type':  'application/json'
  })
};

@Injectable()
export class ApiService {
  todosUrl = '/api/todos';  // URL to web api
  baseUrl = 'http://localhost:8000'
  

  constructor(private http: HttpClient){}

  /** GET Todos from the server */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl+this.todosUrl);
  }

  addTodo(todo: Todo): Observable<Todo> {
    const body = JSON.stringify(todo);
    return this.http.post<Todo>(this.baseUrl+this.todosUrl, body, httpOptions);
  }

  deleteTodo(id: string): Observable<string> {
    const url = `${this.baseUrl+this.todosUrl}/${id}`;
    return this.http.delete<string>(url, httpOptions);
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const id = todo.id;
    const body = JSON.stringify(todo);
    const url = `${this.baseUrl+this.todosUrl}/${id}`;
    return this.http.put<Todo>(url, body, httpOptions)
  }
}
