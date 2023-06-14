import GenerateId from "generate-id";
import Task from "./Task";

const idGenerator = new GenerateId();

export const groupAsTask = (group: Group) => {

  return new Task(group.name, group.description, 'Group')

}

export default class Group {
  id: string | null = null;

  name?: string;

  ignore = false;

  tasks: Record<string, any>;

  description = "";

  constructor(name = "") {
    this.name = name;
    this.id = idGenerator.generate(20);
    this.tasks = {
      active: [],
      backlog: [],
    };
  }
}
