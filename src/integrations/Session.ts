import { addAction } from "@wordpress/hooks";
import { template, templateSettings } from "lodash";

const actionPause = "session:///pause";
const actionComplete = "session:///break";
const actionStart =
  "session:///start?intent={{taskTitle}}&duration={{duration}}&notes={{taskDescription}}&categoryName={{taskCategory}}";

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const compileTemplate = template(actionStart);

export class SessionPlugin {
  constructor() {
    this.hooks();
  }
  hooks() {
    addAction("task.start", "integration/session", this.startSession);
    addAction("task.next", "integration/session", this.pickNext);
  }
  startSession(task, settings) {
    const sessionUrl = compileTemplate({
      taskTitle: task.title ?? "No Title",
      taskCategory: task.category,
      taskDescription: task.description,
      duration: settings.pomodoroLength,
    });
    window.location.href = sessionUrl;
  }
  pickNext(settings) {
    window.location.href = actionComplete;
  }
}
