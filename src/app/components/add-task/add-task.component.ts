import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';
import { TaskStatus } from '../../models/task';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  employees$: Observable<Employee[]>;
  statuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'DONE'];

  title = '';
  description = '';
  employeeId: number | null = null;
  status: TaskStatus = 'OPEN';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly taskService: TaskService
  ) {
    this.employees$ = this.employeeService.getEmployees();
    this.employeeService.loadEmployees();
  }

  addTask(taskForm: NgForm): void {
    if (taskForm.invalid || !this.employeeId) {
      return;
    }

    this.taskService.addTask({
      title: this.title.trim(),
      description: this.description.trim(),
      employeeId: Number(this.employeeId),
      status: this.status
    }).subscribe({
      next: () => {
        taskForm.resetForm({
          title: '',
          description: '',
          employeeId: null,
          status: 'OPEN'
        });
      },
      error: (error) => console.error('Failed to add task', error)
    });
  }
}
