import SettingsGeneral from "../components/SettingsGeneral.vue";
import SettingsCategories from "../components/SettingsCategories.vue";
import SettingsGroupsWeekdays from "../components/SettingsGroupsWeekdays.vue";
export const settingsScreens = () => [
  {
    id: "general",
    name: "General",
    component: SettingsGeneral,
    global: true,
  },
  {
    id: "categories",
    name: "Categories",
    component: SettingsCategories,
    global: true,
  },
  {
    id: "integrations",
    name: "Integrations",
    component: null,
    global: true,
  },
  {
    id: "editGroup",
    name: "Edit Group",
    component: SettingsGeneral,
    global: false,
  },
  {
    id: "editGroupWeekdays",
    name: "Edit Group Weekdays",
    component: SettingsGroupsWeekdays,
    global: false,
  },
  {
    id: "editTask",
    name: "Edit Task",
    component: null,
    global: false,
  }
]

export const getSettingsScreen = (screen: string) => {
  const _screens = settingsScreens();
  return _screens.find(screenEntry => screenEntry.id === screen) ?? null;
}