import { TaskList } from "./TaskList";
import { useTaskBoardModel } from "./useTaskBoardModel";

export function TaskBoardApp() {
  const {
    counts,
    filter,
    newTaskTitle,
    tasks,
    addTask,
    cycleTask,
    setFilter,
    setNewTaskTitle,
  } = useTaskBoardModel();

  return (
    <div>
      <h1>Task Board</h1>

      <div>
        <span>Total: {counts.total}</span>
        <span> Open: {counts.open}</span>
        <span> Done: {counts.done}</span>
        <span> Important: {counts.important}</span>
      </div>

      <div>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>
          All
        </button>
        <button onClick={() => setFilter("open")} disabled={filter === "open"}>
          Open
        </button>
        <button onClick={() => setFilter("done")} disabled={filter === "done"}>
          Done
        </button>
        <button
          onClick={() => setFilter("important")}
          disabled={filter === "important"}
        >
          Important
        </button>
      </div>

      <div>
        <input
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
        />
        <button onClick={addTask}>Add task</button>
      </div>

      <TaskList tasks={tasks} onCycleTask={cycleTask} />
    </div>
  );
}
