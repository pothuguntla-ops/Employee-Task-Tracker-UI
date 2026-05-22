import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;

  name = '';
  email = '';
  role = '';

  constructor(private readonly employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getEmployees();
    this.employeeService.loadEmployees();
  }

  addEmployee(employeeForm: NgForm): void {
    if (employeeForm.invalid) {
      return;
    }

    this.employeeService.addEmployee({
      name: this.name.trim(),
      email: this.email.trim(),
      role: this.role.trim()
    }).subscribe({
      next: () => employeeForm.resetForm(),
      error: (error) => console.error('Failed to add employee', error)
    });
  }
}
