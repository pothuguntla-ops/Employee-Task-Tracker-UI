import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employees: Employee[] = [
    { id: 1, name: 'Aarav Sharma', role: 'Frontend Developer', department: 'Engineering' },
    { id: 2, name: 'Maya Patel', role: 'QA Analyst', department: 'Quality' },
    { id: 3, name: 'Noah Williams', role: 'Project Manager', department: 'Operations' },
    { id: 4, name: 'Sophia Chen', role: 'UX Designer', department: 'Design' }
  ];

  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find((employee) => employee.id === id);
  }
}
