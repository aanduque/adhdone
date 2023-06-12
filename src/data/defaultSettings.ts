export const defaultSettings = {
linearApiKey: "",
lang: "pt-br",
maxGroups: 3,
maxTasksPerGroup: 5,
maxRoundsPerTask: 3,
pomodoroLength: 25,
maxSkips: 3,
actionPause: "session:///pause",
actionComplete: "session:///break",
actionStart: "session:///start?intent={{taskTitle}}&duration={{duration}}&notes={{taskDescription}}&categoryName={{taskCategory}}",
};
