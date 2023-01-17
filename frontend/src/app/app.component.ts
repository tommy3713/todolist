import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ApiService } from './api.service';
import { Todo } from './todos/todos'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ApiService],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TodoList';
  taskName = '';
  status = 'Todo';
  itemCanEdit = [false, false, false];
  todos: Todo[] = [

  ];
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal
  ){}
  generateID = () => new Date().getTime().toString();
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
  }
  handleClickAddTask(){
    const todo: Todo = {
      id: this.generateID(),
      taskName: this.taskName,
      status: "Todo"
    }
    this.addTodo(todo);
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
    modalRef.result.then((taskName: string) => {
      this.todos[index].taskName = taskName;
      this.updateTodo(index);
    });
  }
  ngOnInit(): void {
  }

}
