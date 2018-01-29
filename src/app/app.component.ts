import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder ,  Validators  } from '@angular/forms';

import { TasksModel } from './shared/models/tasks.model';

import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  valForm: FormGroup;
  modalOpen = false;
  allTasks;
  editTaskData: any = false;

  formErrors = {
    name: '',
    status: ''
  };
  formValue = {
    id: null,
    name: null,
    status: null,
    description: null,
  };
  status = {
    toDoTask : 0,
    doingTask : 1,
    doneTask : 2
  };

  constructor (
      private localStorageService: LocalStorageService,
      private fb: FormBuilder
  ) {}

  ngOnInit () {
    this.buildForm();
    this.allTasks = this.localStorageService.getAllTasks();
  }

  buildForm (): void {
    this.valForm = this.fb.group({
      name: ['', [
        Validators.required,
      ]],
      status: ['', [
        Validators.required,
      ]],
      description: [],
    });
    this.valForm.valueChanges.subscribe(data => this.onValueChange());
  }

  onValueChange (): void {
    for (let item in this.formErrors) {
      this.formErrors[item] = '';
      let control = this.valForm.get(item);
      console.log(item);
      if (control && control.dirty && !control.valid) {
        this.formErrors[item] = true;
      }
    }
  }

  addTask (): void {
    if (this.valForm.valid) {
      this.closeModal();
      this.valForm.value['status'] = Number(this.valForm.value['status']);
      this.localStorageService.setTask(this.valForm.value);
      this.updateTasks();
    }
  }

  deleteTask (id: number, status: number): void {
    this.localStorageService.deleteTask(id, status);
    this.closeModal();
    this.updateTasks();
  }

  changeTask (id: number, status: number): void {
    if (this.valForm.valid) {
      this.valForm.value['status'] = Number(this.valForm.value['status']);
      this.localStorageService.editTask(id, status , this.valForm.value);
      this.closeModal();
      this.updateTasks();
    }
  }

  openModal (): void {
    this.modalOpen = true;
  }

  closeModal (): void {
    this.modalOpen = false;
    this.clearValue();
  }

  updateTasks (): void {
    this.allTasks = this.localStorageService.getAllTasks();
  }

  editTask (id: number, status: number): void {
    this.editTaskData = this.allTasks[status].filter( function (item: TasksModel) {
      return item.id === id;
    });

    this.openModal();
  }

  private clearValue () {
    for (let item in this.formValue) {
      this.formValue[item] = null;
    }
    this.editTaskData = false;
  }


  onItemDrop(e: any, status: number) {
    let data = e.dragData.split(';');
    if (Number(data[1]) === status) {
      return false;
    } else {
      this.localStorageService.changeDragDrop(Number(data[0]), Number(data[1]), status);
    }
    this.updateTasks();
  }
}
