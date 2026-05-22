export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface EmployeeTask {
  id: number;
  title: string;
  description: string;
  employeeId: number;
  dueDate: string;
  status: TaskStatus;
}
