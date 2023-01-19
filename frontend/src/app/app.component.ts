import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from './api.service';
import { Todo } from './todos/todos'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { lastValueFrom, pipe } from 'rxjs';

enum Status{
  Todo = 'Todo',
  InProgress = 'In Progress',
  Complete = 'Complete'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ApiService],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TodoList';
  taskName = '';
  checkBoxStatus = {
    todo: true,
    inProgress: true,
    complete: true
  }
  
  // {id:123, taskName:"dohw", status:"in progress"}
  todos: Todo[] = [];
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal
  ){

  }
  generateID = () => new Date().getTime().toString();
  drop(event: CdkDragDrop<Todo[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
  }
  handleClickAddTask(){
    const todo: Todo = {
      id: this.generateID(),
      taskName: this.taskName,
      status: "Todo"
    }
    this.addTodo(todo);
    this.taskName = '';
  }
  async refreshTodos(){
    this.todos = await lastValueFrom(this.apiService.getTodos())
  }
  addTodo(todo: Todo){
    this.apiService
      .addTodo(todo)
      .subscribe(todo => {
        this.todos.push(todo)
      });
  }
  updateTodo(index: number){
    this.apiService
      .updateTodo(this.todos[index])
      .subscribe();
  }
  deleteTodo(index: number){
    this.apiService
      .deleteTodo(this.todos[index].id)
      .subscribe(()=>{
        this.todos.splice(index,1);
      });
  }

  openModal(index: number){
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.taskName = this.todos[index].taskName;
    modalRef.result.then((newTaskName: string) => {
      this.todos[index].taskName = newTaskName;
      this.updateTodo(index);
    });
  }
  async handleFilter(){
    await this.refreshTodos();
    const filterdTodos: Todo[] = this.todos.filter((todo)=>{
      if (this.checkBoxStatus.todo && todo.status==='Todo') return true
      if (this.checkBoxStatus.inProgress && todo.status==='In Progress') return true
      if (this.checkBoxStatus.complete && todo.status==='Complete') return true
      return false
    })
    this.todos.splice(0, this.todos.length, ...filterdTodos);    
  }
  async ngOnInit(): Promise<void> {
    await this.refreshTodos();
  }

}
