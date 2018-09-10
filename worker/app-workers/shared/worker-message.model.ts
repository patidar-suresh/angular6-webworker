export class WorkerMessage {
  topic: string;
  data: any;

  constructor(topic: string, data: any) {
    this.topic = topic;
    this.data = data;
  }

  public static getInstance(value: any): WorkerMessage {
    const { topic, data } = value;
    return new WorkerMessage(topic, data);
  }
}
