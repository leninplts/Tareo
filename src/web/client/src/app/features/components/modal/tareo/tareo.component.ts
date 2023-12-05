import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TareoFormComponent } from '../tareo-form/tareo-form.component';
import { ITareo, Worker } from 'src/app/features/interfaces/worker.interface';
import { TareoService } from 'src/app/core/services/tareo.service';

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
  today: Date = new Date();
  year: number = this.today.getFullYear()
  month: number = this.today.getMonth() + 1

  constructor(
    private modalService: NzModalService,
    private tareoService: TareoService
  ) {}

  ngOnInit(): void {
    this.getTareoByWorker(this.year, this.month)
  }

  getTareoByWorker(year: number, month: number) {
    this.tareoService.getTareo(this.worker.id, year, month).subscribe(
      res => {
        if (res == null) {
          const tareoJson = this.createTareo()
          console.log(tareoJson.length);
          let body = {
            workerId: this.worker.id,
            year: year,
            month: month,
            tareo: tareoJson,
          }
          this.tareoService.create(body).subscribe(
            res => {
              this.worker = res
              this.decodeJson(this.worker.tareos[0].tareo)
              this.getDaysFromDate(year, month);
            }
          )
        } else {
          // console.log(JSON.parse(this.worker.tareos[0].tareo.toString()) as ITareo);
          this.worker = res
          this.decodeJson(this.worker.tareos[0].tareo)
          this.getDaysFromDate(year, month);
        }
      }
    )
  }

  decodeJson(tareosJson: ITareo[]) {
    this.worker.tareos[0].tareo = JSON.parse(tareosJson.toString()) as ITareo[]
  }

  createTareo() {
    const startDate = moment.utc(`${this.year}/${this.month}/01 06:00:00`);
    const endDate = startDate.clone().endOf('month');
    const diffDays = endDate.diff(startDate, 'days', true);
    const numberDays = Math.round(diffDays);
    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      return {
        day: a,
        state: '',
        note: '',
      };
    });
    return JSON.stringify(arrayDays)
  }

  getDaysFromDate(year: number, month: number) {
    const startDate = moment.utc(`${year}/${month}/01 06:00:00`);
    const endDate = startDate.clone().endOf('month');
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true);
    const numberDays = Math.round(diffDays);
    this.startDayIndex = startDate.isoWeekday()

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a} 06:00:00`);
      const tareo = this.worker.tareos[0].tareo.find(tareo => tareo.day == a);
      const color = this.states.find(color => color.name == tareo?.state)
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
  }

  changeMonth(flag: number) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, 'month');
      this.getTareoByWorker(prevDate.format('YYYY'), prevDate.format('MM'))
      // this.getDaysFromDate(prevDate.format('YYYY'), prevDate.format('MM'));
    } else {
      const nextDate = this.dateSelect.clone().add(1, 'month');
      this.getTareoByWorker(nextDate.format('YYYY'), nextDate.format('MM'));
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
