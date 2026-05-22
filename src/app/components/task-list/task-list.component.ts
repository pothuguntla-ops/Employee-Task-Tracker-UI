import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { EmployeeTask, TaskStatus } from '../../models/task';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';

type TaskFilter = 'All' | TaskStatus;

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks$: Observable<EmployeeTask[]>;
  filterOptions: TaskFilter[] = ['All', 'Pending', 'In Progress', 'Completed'];
  selectedFilter: TaskFilter = 'All';
  statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
  private readonly selectedFilterSubject = new BehaviorSubject<TaskFilter>('All');

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly taskService: TaskService
  ) {
    this.tasks$ = combineLatest([this.taskService.getTasks(), this.selectedFilterSubject]).pipe(
      map(([tasks, filter]) => (filter === 'All' ? tasks : tasks.filter((task) => task.status === filter)))
    );
  }

  getEmployeeName(employeeId: number): string {
    return this.employeeService.getEmployeeById(employeeId)?.name ?? 'Unassigned';
  }

  updateStatus(taskId: number, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as TaskStatus;
    this.taskService.updateTaskStatus(taskId, status);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  setFilter(filter: TaskFilter): void {
    this.selectedFilter = filter;
    this.selectedFilterSubject.next(filter);
  }
}
