import moment from "moment/min/moment-with-locales";
import { defaultSettings } from "./defaultSettings";

export const defaultState = {
  activeBlock: null,
  blocks: [
    {
      name: "Manhã",
      description: "Tarefas a serem realizadas na parte da manhã.",
      start: "05:00",
      end: "12:00",
      checklist: "050GV2UpUMeHX8jb3Xs3",
      groups: ["050GV2UpUMeHX8jb3Xs3"],
    },
    {
      name: "Noite",
      description: "Tarefas a serem realizadas na parte da manhã.",
      start: "22:00",
      end: "23:59",
      checklist: "050GV2UpUMeHX8jb3Xs3",
      groups: ["050GV2UpUMeHX8jb3Xs3"],
    },
  ],
  history: [],
  lastSync: 0,
  currentSession: null,
  pageTitle: "",
  lastCategory: "",
  sessions: [],
  notes: [
    {
      id: "sasasasa",
      createdAt: moment().format(),
      title: null,
      content: "My note",
      ownerType: "task",
      ownerId: "",
    },
  ],
  categories: [
    {
      name: "General",
      color: "#1abc9c",
    },
    {
      name: "Personal",
      color: "#16a085",
    },
    {
      name: "Development",
      color: "#2980b9",
    },
  ],
  settings: defaultSettings,
  hoveredGroup: null,
  hoveredTask: null,
  currentView: "groups",
  groups: [
    {
      id: "group1",
      name: "",
      ignore: false,
      tasks: {
        active: [
          {
            id: "firstTask",
            title: "My Task",
            description: "",
            category: "development",
            done: false,
            jumped: false,
            counter: 0,
          },
        ],
        finished: [],
        backlog: [],
      },
    },
    {
      id: "group2",
      name: "",
      ignore: false,
      tasks: {
        active: [
          {
            id: "secondTask",
            title: "My Second Task",
            description: "",
            category: "development",
            done: false,
            jumped: false,
            counter: 0,
          },
        ],
        finished: [],
        backlog: [],
      },
    },
  ],
};
