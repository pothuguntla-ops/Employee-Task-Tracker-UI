import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { EmployeeTask, TaskStatus } from '../models/task';

export type CreateTaskRequest = Omit<EmployeeTask, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:8080/api/tasks';
  private readonly tasksSubject = new BehaviorSubject<EmployeeTask[]>([]);

  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<EmployeeTask[]> {
    return this.tasksSubject.asObservable();
  }

  loadTasks(): void {
    this.http.get<EmployeeTask[]>(this.apiUrl).subscribe({
      next: (tasks) => this.tasksSubject.next(tasks),
      error: (error) => console.error('Failed to load tasks', error)
    });
  }

  addTask(task: CreateTaskRequest): Observable<EmployeeTask> {
    return this.http.post<EmployeeTask>(this.apiUrl, task).pipe(
      tap((createdTask) => {
        this.tasksSubject.next([...this.tasksSubject.value, createdTask]);
      })
    );
  }

  updateTaskStatus(taskId: number, status: TaskStatus): Observable<EmployeeTask> {
    return this.http.put<EmployeeTask>(`${this.apiUrl}/${taskId}/status`, { status }).pipe(
      tap((updatedTask) => {
        const updatedTasks = this.tasksSubject.value.map((task) =>
          task.id === taskId ? updatedTask : task
        );
        this.tasksSubject.next(updatedTasks);
      })
    );
  }

  getTasksByEmployee(employeeId: number): Observable<EmployeeTask[]> {
    return this.http.get<EmployeeTask[]>(`http://localhost:8080/api/employees/${employeeId}/tasks`);
  }
}
