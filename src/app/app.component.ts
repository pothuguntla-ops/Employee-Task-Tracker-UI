import { Component } from '@angular/core';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [AddTaskComponent, EmployeeListComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'employee-task-tracker';
}
