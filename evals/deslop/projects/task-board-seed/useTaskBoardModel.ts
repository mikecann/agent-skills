import { useMemo, useState } from "react";
import { createTask, getTaskCounts, getVisibleTasks, toggleTaskStatus } from "./taskStore";
import type { Task, TaskFilter } from "./types";

const initialTasks: Task[] = [
  createTask({ id: "task-1", title: "Write docs" }),
  createTask({ id: "task-2", title: "Review PR", isImportant: true }),
  {
    id: "task-3",
    title: "Ship feature",
    status: "done",
    isImportant: false,
  },
];

export function useTaskBoardModel() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const visibleTasks = useMemo(
    () => getVisibleTasks({ filter, tasks }),
    [filter, tasks],
  );

  const counts = useMemo(() => getTaskCounts({ tasks }), [tasks]);

  function addTask() {
    const title = newTaskTitle.trim();
    if (!title) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      createTask({
        id: `task-${currentTasks.length + 1}`,
        title,
      }),
    ]);
    setNewTaskTitle("");
  }

  function cycleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;
        return toggleTaskStatus({ task });
      }),
    );
  }

  return {
    counts,
    filter,
    newTaskTitle,
    tasks: visibleTasks,
    addTask,
    cycleTask,
    setFilter,
    setNewTaskTitle,
  };
}
