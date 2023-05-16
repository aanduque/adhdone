import GenerateId from "generate-id";

const idGenerator = new GenerateId();

export default class Session {
  id: string | null = null;
  taskId?: string;
  task?: Record<any, any>;
  startedAt?: any;
  endedAt?: any;
  constructor(task) {
    this.id = idGenerator.generate(20);
    this.taskId = task.id;
    this.task = task;
    this.startedAt = Date.now();
  }
}
