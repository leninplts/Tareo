import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { WorkerService } from 'src/app/core/services/worker.service';
import { TareoComponent } from 'src/app/features/components/modal/tareo/tareo.component';
import { Worker } from 'src/app/features/interfaces/worker.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  listOfWorkers: Worker[] = []
  constructor(
    private modalService: NzModalService,
    private workerService: WorkerService
  ) { }

  ngOnInit(): void {
    this.workerService.getAll().subscribe(
      res => {
        this.listOfWorkers = res
        // this.openModal(this.listOfWorkers[0])
      }
    )
  }

  openModal(worker: Worker, edit: boolean = false) {
    const myModal = this.modalService.create({
      // @ts-ignore
      nzTitle: null,
      // nzClassName: 'full-screen',
      nzContent: TareoComponent,
      nzFooter: null,
      nzNoAnimation: true,
      nzWidth: 400,
      nzComponentParams: { worker, edit }
    });
    myModal.afterClose.subscribe((result) => {
      // this.mapboxHelper.clearSelectedNearby();
    })
  }
}
