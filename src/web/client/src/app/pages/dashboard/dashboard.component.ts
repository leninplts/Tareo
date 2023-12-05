import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TareoComponent } from 'src/app/features/components/modal/tareo/tareo.component';
import { Worker } from 'src/app/features/interfaces/worker.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  listOfWorkers: Worker[] = [
    {
      name: 'Lenin Jose mamani',
      dni: '70125199',
      year: 2023,
      month: 11,
      tareos: [
        {
          dia: 1,
          estado: 'FI',
          note: 'falta injustificada por el trabajador'
        },
        {
          dia: 2,
          estado: 'DL',
          note: ''
        },
        {
          dia: 3,
          estado: 'DL',
          note: ''
        },
        {
          dia: 4,
          estado: 'DL',
          note: ''
        },
        {
          dia: 5,
          estado: 'FJ',
          note: ''
        },
        {
          dia: 6,
          estado: 'DD',
          note: ''
        },
      ]
    },
    {
      name: 'Rossy Pancca Sardon',
      dni: '74074424',
      year: 2023,
      month: 12,
      tareos: [
        {
          dia: 1,
          estado: 'DL',
          note: ''
        },
        {
          dia: 2,
          estado: 'FJ',
          note: ''
        },
        {
          dia: 3,
          estado: 'FI',
          note: ''
        },
        {
          dia: 4,
          estado: 'DD',
          note: ''
        },
      ]
    }
  ]
  constructor(
    private modalService: NzModalService
  ) { }

  ngOnInit(): void {
    this.openModal(this.listOfWorkers[0])
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
