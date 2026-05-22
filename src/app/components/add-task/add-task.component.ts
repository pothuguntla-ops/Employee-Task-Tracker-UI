import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  employees: Employee[] = [];

  title = '';
  description = '';
  employeeId: number | null = null;
  dueDate = '';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly taskService: TaskService
  ) {
    this.employees = this.employeeService.getEmployees();
  }

  addTask(): void {
    if (!this.title.trim() || !this.description.trim() || !this.employeeId || !this.dueDate) {
      return;
    }

    this.taskService.addTask({
      title: this.title.trim(),
      description: this.description.trim(),
      employeeId: Number(this.employeeId),
      dueDate: this.dueDate
    });

    this.title = '';
    this.description = '';
    this.employeeId = null;
    this.dueDate = '';
  }
}
