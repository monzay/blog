     export function calculateTaskDistribution(tarea) {
        const taskDistribution = distributeTasks(tarea, 3, [[], [], []]);
        return taskDistribution;
      }
  
      function distributeTasks(tasks, columns, array) {
        const distributedTasks = array;
        for (let i = 0; i < tasks.length; i++) {
          const columnIndex = i % columns;
          distributedTasks[columnIndex].push(tasks[i]);
        }
        return distributedTasks;
      }