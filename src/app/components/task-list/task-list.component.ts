import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { EmployeeTask, TaskStatus } from '../../models/task';
import { EmployeeService } from '../../services/employee.service';
import { TaskService } from '../../services/task.service';

type TaskFilter = 'All' | TaskStatus;

@Component({
  selector: 'app-task-list',
  imports: [AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks$: Observable<EmployeeTask[]>;
  filterOptions: TaskFilter[] = ['All', 'OPEN', 'IN_PROGRESS', 'DONE'];
  selectedFilter: TaskFilter = 'All';
  statuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'DONE'];
  private readonly selectedFilterSubject = new BehaviorSubject<TaskFilter>('All');

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly taskService: TaskService
  ) {
    this.employeeService.loadEmployees();
    this.taskService.loadTasks();

    this.tasks$ = combineLatest([this.taskService.getTasks(), this.selectedFilterSubject]).pipe(
      map(([tasks, filter]) => (filter === 'All' ? tasks : tasks.filter((task) => task.status === filter)))
    );
  }

  getEmployeeName(employeeId: number): string {
    return this.employeeService.getEmployeeById(employeeId)?.name ?? 'Unassigned';
  }

  updateStatus(taskId: number, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as TaskStatus;
    this.taskService.updateTaskStatus(taskId, status).subscribe({
      error: (error) => console.error('Failed to update task status', error)
    });
  }

  setFilter(filter: TaskFilter): void {
    this.selectedFilter = filter;
    this.selectedFilterSubject.next(filter);
  }

  getStatusLabel(status: TaskStatus): string {
    return status.replace('_', ' ');
  }
}
