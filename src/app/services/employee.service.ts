import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Employee } from '../models/employee';

export type CreateEmployeeRequest = Omit<Employee, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:8080/api/employees';
  private readonly employeesSubject = new BehaviorSubject<Employee[]>([]);

  constructor(private readonly http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  loadEmployees(): void {
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (employees) => this.employeesSubject.next(employees),
      error: (error) => console.error('Failed to load employees', error)
    });
  }

  addEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap((createdEmployee) => {
        this.employeesSubject.next([...this.employeesSubject.value, createdEmployee]);
      })
    );
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employeesSubject.value.find((employee) => employee.id === id);
  }
}
