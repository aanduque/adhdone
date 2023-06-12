import GenerateId from "generate-id";
import Task from "./Task";
import Group from "./Group";

const idGenerator = new GenerateId();

export default class Block {
  id: string | null = null;

  name?: string;

  description = "";

  checklist: string | null = null;

  groups: Group[] = [];

  constructor(name = "") {
    this.name = name;
    this.id = idGenerator.generate(20);
  }

  isGroupChecklist(groupId: string): boolean {
    return this.checklist === groupId;
  }

  setGroupAsChecklist(groupId: string) {
    this.checklist = groupId;
    return this;
  }

}
