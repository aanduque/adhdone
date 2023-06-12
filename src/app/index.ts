import GroupGrid from "@/components/GroupGrid.vue";
import InboxView from "@/components/InboxView.vue";
import { InboxIcon, SquaresPlusIcon } from "@heroicons/vue/24/outline";

export const views = () => [
  {
    id: "groups",
    name: "All",
    icon: SquaresPlusIcon,
    filter: () => true,
    component: GroupGrid,
  },
  {
    id: "inbox",
    name: "Inbox",
    icon: InboxIcon,
    filter: (group, groupIndex) => groupIndex === 0,
    count: 10,
    component: InboxView,
  },
  {
    id: "focus",
    name: "Focus View",
    icon: SquaresPlusIcon,
    filter: (group, groupIndex) => groupIndex === 2,
    component: GroupGrid,
  },
  {
    id: "zen",
    name: "Zen View",
    icon: SquaresPlusIcon,
    filter: (group, groupIndex) => groupIndex === 0,
    component: GroupGrid,
  },
];

export const getView = (view: string) => {
  const _views = views();
  return _views.find(viewEntry => viewEntry.id === view) ?? _views[2];
}