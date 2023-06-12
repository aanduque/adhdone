import Session from "@/models/Session";
import { doAction } from "@wordpress/hooks";

export const STORAGE_KEY = 'todos-vuejs'

// for testing
if (navigator.webdriver) {
  window.localStorage.clear()
}


const endCurrentSession = () => {
  data.value.currentSession.endedAt = Date.now();
  data.value.sessions = data.value.sessions ?? [];
  data.value.sessions.push(data.value.currentSession);
  data.value.currentSession = null;
};

export const mutations = {
  switchView(state, view) {
    state.currentView = view
  },
  setCurrentTask(state, task) {
    state.currentTask = task
  },
  startSession(state, task) {
    state.currentSession = new Session(task);
    doAction("task.start", task, state.settings);
  },
  endSession(state) {
    state.currentSession.endedAt = Date.now();
    state.sessions = state.sessions ?? [];
    state.sessions.push(state.currentSession);
    state.currentSession = null;
  },
}