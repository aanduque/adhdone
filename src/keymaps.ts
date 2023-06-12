export default () => {
  return {
    // 'esc+ctrl' is OK.
    "shift+esc": (event) => {
      openedGroups.value = {};
    },
    x: (event) => {
      if (selectedTasks.value.includes(data.value.hoveredTask.taskId)) {
        const index = findIndex(
          selectedTasks.value,
          data.value.hoveredTask.taskId
        );
        selectedTasks.value.splice(index, 1);
      } else {
        selectedTasks.value.push(data.value.hoveredTask.taskId);
      }
      selectedTasks.value = uniq(selectedTasks.value);
      console.log(selectedTasks.value);
    },
    "shift+d": (event) => {
      if (data.value.hoveredTask.taskId) {
        const task = getTaskBy(
          data.value.hoveredTask.groupId,
          data.value.hoveredTask.taskId
        );
        task && (task.done = !task.done);
      }
    },
    "shift+i": (event) => {
      if (data.value.hoveredGroup) {
        const group = getGroupBy(data.value.hoveredGroup);
        group.ignore = !group.ignore;
      }
    },
    "shift+c": (event) => {
      if (data.value.hoveredTask.taskId) {
        const task = getTaskBy(
          data.value.hoveredTask.groupId,
          data.value.hoveredTask.taskId
        );
        task && (task.canceled = !task.canceled);
      }
    },
    "shift+p": (event) => {
      if (data.value.hoveredTask.taskId) {
        const task = getTaskBy(
          data.value.hoveredTask.groupId,
          data.value.hoveredTask.taskId
        );
        task && pickTask(task);
      }
    },
    o: (event) => {
      if (data.value.hoveredGroup) {
        const group = getGroupBy(data.value.hoveredGroup);
        toggleGroup(group);
      }
    },
    "shift+o": (event) => {
      for (const group of data.value.groups) {
        setTimeout(() => {
          toggleGroup(group);
        }, 0);
      }
    },
    c: (event) => {
      if (data.value.hoveredGroup) {
        const group = getGroupBy(data.value.hoveredGroup);

        if (group) {
          addTask(group);
        }
      }
    },
  };
}