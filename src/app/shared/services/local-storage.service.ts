import { Injectable } from '@angular/core';
import { TasksModel } from '../models/tasks.model';

@Injectable()
export class LocalStorageService {
    private localStorage = window['localStorage'];
    private allTasks  = this.getAllTasks();

    public setTask (tasks: TasksModel): void {
        if (!this.allTasks) {
            this.allTasks = {};
        }

        this.changeStatus(tasks);
        this.saveTasks();
    }

    public getAllTasks () {
        return JSON.parse(this.localStorage.getItem('tasks'));
    }

    public deleteTask (id: number, status: number): void {
        this.allTasks[status].forEach( (item: TasksModel, index, object) => {
            if (item.id === id) {
                object.splice(index, 1);
            }
        });
        this.saveTasks();
    }

    public editTask (id: number, status: number, task: TasksModel): void {
        this.allTasks[status].forEach( (item, index, object) => {
            if (item.id === id) {
                if (status === task['status']) {
                    item.name = task['name'];
                    item.description = task['description'];
                } else {
                    object.splice(index, 1);
                    this.changeStatus (task);
                }
            }
        });
        this.saveTasks();
    }

    public saveTasks (): void {
        this.localStorage.setItem('tasks', JSON.stringify(this.allTasks));
    }

    public changeDragDrop (id: number, oldStatus: number, newStatus: number): void {
        let task;
        this.allTasks[oldStatus].forEach( (item: TasksModel, index, object) => {
            if (item.id === id) {
                task = item;
                task['status'] = newStatus;
                object.splice(index, 1);
                this.changeStatus(task);
            }
        });
        this.saveTasks();
    }

    private changeStatus (task: TasksModel): void {
        let id = 1;
        if (!this.allTasks[task['status']]) {
            this.allTasks[task['status']] = [];
        } else if ( this.allTasks[task['status']].length !== 0 )  {
            id = Number(this.allTasks[task['status']][this.allTasks[task['status']].length - 1]['id'] ) + 1;
        }

        task['id'] = Number(id);
        this.allTasks[task.status].push(
            task,
        );
    }
}