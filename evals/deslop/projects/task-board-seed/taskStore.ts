import type { Task, TaskCounts, TaskFilter } from "./types";

export function createTask({
  id,
  title,
  isImportant = false,
}: {
  id: string;
  title: string;
  isImportant?: boolean;
}): Task {
  return {
    id,
    title,
    status: "todo",
    isImportant,
  };
}

export function toggleTaskStatus({
  task,
}: {
  task: Task;
}): Task {
  if (task.status === "todo")
    return {
      ...task,
      status: "inProgress",
    };

  if (task.status === "inProgress")
    return {
      ...task,
      status: "done",
    };

  return {
    ...task,
    status: "todo",
  };
}

export function getVisibleTasks({
  filter,
  tasks,
}: {
  filter: TaskFilter;
  tasks: Task[];
}) {
  if (filter === "all") return tasks;
  if (filter === "open") return tasks.filter((task) => task.status !== "done");
  if (filter === "done") return tasks.filter((task) => task.status === "done");
  return tasks.filter((task) => task.isImportant);
}

export function getTaskCounts({
  tasks,
}: {
  tasks: Task[];
}): TaskCounts {
  const total = tasks.length;
  const open = tasks.filter((task) => task.status !== "done").length;
  const done = tasks.filter((task) => task.status === "done").length;
  const important = tasks.filter((task) => task.isImportant).length;

  return {
    total,
    open,
    done,
    important,
  };
}
