import GroupGrid from "@/components/GroupGrid.vue";
import InboxView from "@/components/InboxView.vue";
import { BellSlashIcon, InboxIcon, MinusCircleIcon, SparklesIcon, SquaresPlusIcon } from "@heroicons/vue/24/outline";

export const views = () => [
  {
    id: "focus",
    name: "Focus",
    icon: SparklesIcon,
    filter: (group, groupIndex) => groupIndex === 2,
    component: GroupGrid,
  },
  {
    id: "groups",
    name: "All",
    icon: SquaresPlusIcon,
    filter: () => true,
    component: GroupGrid,
  },
  {
    id: "minimized",
    name: "Minimized",
    icon: MinusCircleIcon,
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
  // {
  //   id: "zen",
  //   name: "Zen",
  //   icon: BellSlashIcon,
  //   filter: (group, groupIndex) => groupIndex === 0,
  //   component: GroupGrid,
  // },
];

export const getView = (view: string) => {
  const _views = views();
  return _views.find(viewEntry => viewEntry.id === view) ?? _views[2];
}
