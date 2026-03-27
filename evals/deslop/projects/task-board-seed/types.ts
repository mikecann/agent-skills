export type TaskStatus = "todo" | "inProgress" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  isImportant: boolean;
};

export type TaskFilter = "all" | "open" | "done" | "important";

export type TaskCounts = {
  total: number;
  open: number;
  done: number;
  important: number;
};
