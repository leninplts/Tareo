import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TareoFormComponent } from '../tareo-form/tareo-form.component';
import { Worker } from 'src/app/features/interfaces/worker.interface';

@Component({
  selector: 'app-tareo',
  templateUrl: './tareo.component.html',
  styleUrls: ['./tareo.component.scss']
})
export class TareoComponent implements OnInit {
  @Input() worker: Worker;
  @Input() edit: boolean;

  states = [
    { id: 1,name: 'DL', color: '#24fc077e', description: 'Dia laborado'},
    { id: 2,name: 'FJ', color: '#5bf4ffa6', description: 'Falta justificada'},
    { id: 3,name: 'FI', color: '#ff5b5ba6', description: 'Falta injustificada'},
    { id: 4,name: 'DD', color: '#fcff42cb', description: 'Descanso'},
  ]
  week: any = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ];

  monthSelect: any[];
  dateSelect: any;
  dateValue: any;
  localDate: any;
  startDayIndex: number = 0;

  constructor(
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    console.log('object');
    this.getDaysFromDate(12, 2023);
  }

  getDaysFromDate(month: number, year: number) {
    const startDate = moment.utc(`${year}/${month}/01 06:00:00`);
    const endDate = startDate.clone().endOf('month');
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true);
    const numberDays = Math.round(diffDays);
    this.startDayIndex = startDate.isoWeekday()

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a} 06:00:00`);
      const tareo = this.worker.tareos.find(tareo => tareo.dia == a);
      const color = this.states.find(color => color.name == tareo?.estado)
      return {
        name: dayObject.format('dddd'),
        value: a,
        indexWeek: dayObject.isoWeekday(),
        data: tareo,
        user: this.worker,
        date: moment.utc(`${year}/${month}/${a} 06:00:00`),
        state: color,
        states: this.states
      };
    });
    this.monthSelect = arrayDays;
    console.log(this.monthSelect);
  }

  changeMonth(flag: number) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, 'month');
      this.getDaysFromDate(prevDate.format('MM'), prevDate.format('YYYY'));
    } else {
      const nextDate = this.dateSelect.clone().add(1, 'month');
      this.getDaysFromDate(nextDate.format('MM'), nextDate.format('YYYY'));
    }
  }

  clickDay(day: { value: any; }) {
    const monthYear = this.dateSelect.format('YYYY-MM');
    const parse = `${monthYear}-${day.value}`;
    const objectDate = moment(parse);
    this.dateValue = objectDate;
    const myModal = this.modalService.create({
      // @ts-ignore
      nzTitle: null,
      // nzClassName: 'full-screen',
      nzContent: TareoFormComponent,
      nzFooter: null,
      nzNoAnimation: true,
      nzWidth: 400,
      nzComponentParams: { tareo: day }
    });
    myModal.afterClose.subscribe((result) => {
      // this.mapboxHelper.clearSelectedNearby();
    })
  }

}
