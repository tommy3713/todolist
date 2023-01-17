import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  
  @Input()
  taskName!: string;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  newTaskName!: string;
  
  ngOnInit() {
    this.newTaskName = this.taskName
  }

  closeModal(taskName: string) {
    this.activeModal.close(taskName);
  }

}
