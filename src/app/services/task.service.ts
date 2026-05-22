import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeTask, TaskStatus } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly storageKey = 'employee-task-tracker-tasks';

  private readonly defaultTasks: EmployeeTask[] = [
    {
      id: 1,
      title: 'Build dashboard layout',
      description: 'Create the first version of the employee task dashboard.',
      employeeId: 1,
      dueDate: '2026-05-28',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Write login test cases',
      description: 'Cover success and failed login scenarios.',
      employeeId: 2,
      dueDate: '2026-05-30',
      status: 'Pending'
    },
    {
      id: 3,
      title: 'Review sprint priorities',
      description: 'Confirm owners and deadlines for this sprint.',
      employeeId: 3,
      dueDate: '2026-05-24',
      status: 'Completed'
    }
  ];

  private nextId = 4;
  private readonly tasksSubject = new BehaviorSubject<EmployeeTask[]>(this.loadTasks());

  getTasks(): Observable<EmployeeTask[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Omit<EmployeeTask, 'id' | 'status'>): void {
    const newTask: EmployeeTask = {
      ...task,
      id: this.nextId++,
      status: 'Pending'
    };

    this.setTasks([...this.tasksSubject.value, newTask]);
  }

  updateTaskStatus(taskId: number, status: TaskStatus): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );

    this.setTasks(updatedTasks);
  }

  deleteTask(taskId: number): void {
    this.setTasks(this.tasksSubject.value.filter((task) => task.id !== taskId));
  }

  private setTasks(tasks: EmployeeTask[]): void {
    this.tasksSubject.next(tasks);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private loadTasks(): EmployeeTask[] {
    const savedTasks = localStorage.getItem(this.storageKey);

    if (!savedTasks) {
      return this.defaultTasks;
    }

    try {
      const parsedTasks = JSON.parse(savedTasks) as EmployeeTask[];
      this.nextId = Math.max(...parsedTasks.map((task) => task.id), 0) + 1;
      return parsedTasks;
    } catch {
      return this.defaultTasks;
    }
  }
}
