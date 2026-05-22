export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface EmployeeTask {
  id: number;
  title: string;
  description: string;
  employeeId: number;
  status: TaskStatus;
}
