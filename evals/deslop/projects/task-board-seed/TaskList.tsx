import type { Task } from "./types";

export function TaskList({
  onCycleTask,
  tasks,
}: {
  onCycleTask(taskId: string): void;
  tasks: Task[];
}) {
  if (tasks.length === 0) return <div>No tasks yet</div>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <button onClick={() => onCycleTask(task.id)}>
            {task.title} - {task.status}
          </button>
          {task.isImportant ? <strong> important</strong> : null}
        </li>
      ))}
    </ul>
  );
}
