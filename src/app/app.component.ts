import { Component,  OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WorkerService } from './worker.service';
import { WorkerMessage } from '../../worker/app-workers/shared/worker-message.model';
import { WORKER_TOPIC } from '../../worker/app-workers/shared/worker-topic.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  workerTopic: string;
  currentWorkerMessage: WorkerMessage;
  workerServiceSubscription: Subscription;
  workerResponse:string;
  yourText: string;

  constructor(private workerService: WorkerService) { }

  processNonWorker() {
    this.workerResponse ="";
    this.sendNonWorkerRequest(10000);
  }

  processWorker() {
    this.workerResponse ="";
    this.sendWorkerRequest(10000);
  }

  ngOnInit() {
    this.workerTopic = WORKER_TOPIC.cpuIntensive;
    this.listenForWorkerResponse();
  }

  ngOnDestroy(): void {
    if (this.workerServiceSubscription) {
      this.workerServiceSubscription.unsubscribe();
    }
  }

  sendWorkerRequest(duration: number) {
    const workerMessage = new WorkerMessage(this.workerTopic, { duration: duration });
    this.workerService.doWork(workerMessage);
  }

  sendNonWorkerRequest(duration: number) {
    let result = this.cpuIntensiveCalc(duration)
    this.workerResponse = "Total iterations in non web worker mode :- " + result.iteration;
  }

  private listenForWorkerResponse() {
    this.workerServiceSubscription = this.workerService.workerUpdate$
      .subscribe(data => this.workerResponseParser(data));
  }

  private workerResponseParser(message: WorkerMessage) {
    if (message.topic === this.workerTopic) {
      this.currentWorkerMessage = message;
      this.workerResponse = "Total iterations in web worker mode :- " + message.data.iteration;
    }
  }

  private cpuIntensiveCalc(duration: number) {
    const before = new Date();
    let count = 0;
    while (true) {
      count++;
      const now = new Date();
      if (now.valueOf() - before.valueOf() > duration) {
        break;
      }
    }
    return { iteration: count };
  }
}
