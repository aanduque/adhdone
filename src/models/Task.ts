import GenerateId from "generate-id";

const idGenerator = new GenerateId();

export default class Task {
  id = null;

  done = false;

  recurring = false;

  category = "";

  jumped = false;

  counter = 0;

  title = "My Task";

  description = "";

  constructor(task = "My Task", description = "", category = "") {
    this.title = task;
    this.description = description;
    this.category = category;
    this.id = idGenerator.generate(20);
  }
}
