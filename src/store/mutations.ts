import { inject } from 'vue';
import Session from "@/models/Session";
import { doAction } from "@wordpress/hooks";
import { uiState } from '.';
import Group from '@/models/Group';

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
  setLastSync(state, value) {
    state.lastSync = value;
  },
  setInitialState(state, value) {
    value.fromServer = true;
    Object.assign(state, value, { uiState });
  },
  openSettingsScreen(state, screenName, object) {
    state.uiState.settings.screenName = screenName;
    state.uiState.settings.object = object;
    state.uiState.settings.open = true;
  },
  closeSettingsScreen(state) {
    state.uiState.settings.open = false;
  },
  setSettings(state, settings) {
    state.settings = settings;
  },
  setCategories(state, categories) {
    state.categories = categories;
  },
  addNewGroup(state, group = null) {
    group ??= new Group(`Group ${state.groups.length + 1}`)
    group.description = `No description for Group ${state.groups.length + 1}.`
    state.groups.push(Object.assign({}, group));
  },
  getGroupById(state, groupId) {
    return state.groups.find(group => group.id === groupId)
  },
  deleteGroup(state, groupToDelete) {
    state.groups = state.groups.filter(group => {
      if (!groupToDelete.id) {
        return true;
      }
      return group.id !== groupToDelete.id
    })
  },
  updateGroup(state, groupToUpdate) {
    // Find group by id and splice it with the updated group
    const index = state.groups.findIndex(group => group.id === groupToUpdate.id)
    if (index === -1) {
      throw new Error("Group not found.");
    }
    console.log("Updated group:", groupToUpdate)
    state.groups.splice(index, 1, groupToUpdate)
  }
}