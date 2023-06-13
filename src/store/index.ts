import { db } from './../firebase';
import { doc } from 'firebase/firestore';
import { setDoc, getDoc } from 'firebase/firestore';
import { createStore } from "vuex";
import { mutations } from "./mutations";
import actions from "./actions";
import plugins from "./plugins";
import { defaultSettings } from "@/data/defaultSettings";
import { flatten, throttle } from "lodash";
import { getView } from "@/app/views";
import { inject, nextTick, watch } from "vue";
import { getCurrentUser } from 'vuefire';

const getters = {
  /**
   * Compute the total number of tasks
   */
  totalTasks(state) {
    return flatten(
      state.groups
        .filter((group) => !group.ignore)
        .map((group) => group.tasks.active)
    ).filter((task) => !task.canceled).length;
  },

  completedTasks(state) {
    return flatten(
      state.groups
        .filter((group) => !group.ignore)
        .map((group) => group.tasks.active)
    ).filter((task) => task.done).length;
  },

  visibleGroups(state) {

    const filter = getView(state.currentView).filter;

    return state.groups.filter(filter);

  },

  remainingSkips(state) {
    return (
      (state.settings.maxSkips ?? 3) -
      flatten(
        state.groups
          .filter((group) => !group.ignore)
          .map((group) => group.tasks.active)
      ).filter((task) => task.jumped).length
    );
  }
}

export const store = createStore({
  state: {
    fromServer: false,
    currentView: "groups",
    syncing: false,
    lastSync: null,
    barOpen: false,
    history: [],
    pageTitle: "Sábado, 10 de junho de 2023",
    lastCategory: "development",
    categories: [],
    groups: [],
    inbox: {
      name: "📥 Inbox",
      description: "Tarefas que ainda não foram categorizadas.",
      tasks: [
        {
          "id": "lqwiSasF8Y3AyTMeG6gO",
          "done": true,
          "recurring": true,
          "category": "personal",
          "jumped": false,
          "counter": 3,
          "title": "😴 Marcar hora em que acordou (06:30)",
          "description": ""
        },
        {
          "id": "01MhFFY7Cj4lHD035d0Q",
          "done": true,
          "recurring": true,
          "category": "personal",
          "jumped": false,
          "counter": 3,
          "title": "💊 Tomar remédios",
          "description": ""
        },
      ]
    },
    settings: defaultSettings,
    hoveredGroup: null,
    hoveredTask: null,
    currentTask: null,
    currentSession: null,
    expandedActiveTaskBar: false,
    sessions: null,
    hash: null,
  },
  getters,
  actions,
  mutations,
  plugins,
});

setTimeout(() => {

  console.log("Registering the sync listener...");

  store.subscribe(() => {
    sync();
  })

}, 3000);

export const uiState = {
  settings: {
    screenName: null,
    object: null,
    open: false,
  }
}

const sync = throttle(() => {
  getCurrentUser().then((user) => {

    if (!user?.uid) {
      return;
    }

    const data = Object.assign({}, store.state, { uiState: {} });

    console.log("Updating... Check if sync is needed...", user, data);

    const userDoc = doc(db, "users", user.uid)

    setDoc(userDoc, data, { merge: true }).then(() => {

      console.log("Sync finished.");

    }).catch((error) => {

      console.error("Error syncing data.", error);

    })

    nextTick(() => {
      const newSyncTimestamp = Date.now();

      console.log(`Sync finished. New lastSync value: ${newSyncTimestamp}`);

      store.commit("setLastSync", newSyncTimestamp);
    });
  });
}, 30000);

export default store;