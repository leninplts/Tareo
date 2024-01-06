import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TareoFormComponent } from '../tareo-form/tareo-form.component';
import { ITareo, Worker } from 'src/app/features/interfaces/worker.interface';
import { TareoService } from 'src/app/core/services/tareo.service';
import { IState } from 'src/app/features/interfaces/states.inteface';
import { statesDictionary } from 'src/app/features/models/state.model';
import { Router } from '@angular/router';
import { PdfService } from 'src/app/core/services/pdf.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-tareo',
  templateUrl: './tareo.component.html',
  styleUrls: ['./tareo.component.scss']
})
export class TareoComponent implements OnInit {
  @Input() worker: Worker;
  @Input() edit: boolean;

  statesDictionary = statesDictionary
  week: string[] = [
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
  localDate: any;
  startDayIndex: number = 0;
  today: Date = new Date();
  year: number = this.today.getFullYear()
  month: number = this.today.getMonth() + 1
  day: number = this.today.getDate()

  // counting days
  orderedWorkDays = [
    'workedDays', 
    'restDays',
    'justifiedAbsenceDays',
    'unjustifiedAbsenceDays',
    'noFilledDays',
  ];
  workDayDetail : any = {
    justifiedAbsenceDays: { title: 'Faltas justificadas', value: 0, prefix: 'FJ' },
    workedDays: { title: 'Dias trabajados', value: 0, prefix: 'DL' },
    restDays: { title: 'Dias de descanso', value: 0, prefix: 'DD' },
    unjustifiedAbsenceDays: { title: 'Faltas Injustificadas', value: 0, prefix: 'FI' },
    noFilledDays: { title: 'Dias no registrados', value: 0, prefix: 'FD' }
  }

  constructor(
    private modalService: NzModalService,
    private tareoService: TareoService,
    private modalRef: NzModalRef,
    private router: Router,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.getTareoByWorker(this.year, this.month)
  }

  getTareoByWorker(year: number, month: number) {
    this.clearWorkDayDetail()
    this.tareoService.getTareo(this.worker.id, year, month).subscribe({
      next: res => {
        if (res == null) {
          const tareoJson = this.createTareo(year, month)
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
              this.fillCounters()
            }
          )
        } else {
          this.worker = res
          this.decodeJson(this.worker.tareos[0].tareo)
          this.getDaysFromDate(year, month);
          this.fillCounters()
        }
      },
      // complete: () => this.fillCounters()
    })
  }

  fillCounters() {
    this.worker.tareos[0].tareo.forEach(t => {
      if(t.state == 'DL') ++this.workDayDetail.workedDays.value
      if(t.state == 'DD') ++this.workDayDetail.restDays.value
      if(t.state == 'FJ') ++this.workDayDetail.justifiedAbsenceDays.value
      if(t.state == 'FI') ++this.workDayDetail.unjustifiedAbsenceDays.value
      if(t.state == '') ++this.workDayDetail.noFilledDays.value
    })
  }

  clearWorkDayDetail() {
    this.workDayDetail.workedDays.value = 0
    this.workDayDetail.restDays.value = 0
    this.workDayDetail.justifiedAbsenceDays.value = 0
    this.workDayDetail.unjustifiedAbsenceDays.value = 0
    this.workDayDetail.noFilledDays.value = 0
  }

  decodeJson(tareosJson: ITareo[]) {
    this.worker.tareos[0].tareo = JSON.parse(tareosJson.toString()) as ITareo[]
  }

  createTareo(year: number, month: number) {
    const startDate = moment.utc(`${year}-${month}-01 06:00:00`);
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
    const startDate = moment.utc(`${year}-${month}-01 06:00:00`);
    const endDate = startDate.clone().endOf('month');
    this.dateSelect = startDate;

    const diffDays = endDate.diff(startDate, 'days', true);
    const numberDays = Math.round(diffDays);
    this.startDayIndex = startDate.isoWeekday()
    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a <= 9 ? `0${a}` : a + ''} 06:00`);
      const tareo = this.worker.tareos[0].tareo.find(tareo => tareo.day == a);
      return {
        currentDate: { year, month, day: a, date: dayObject },
        detail: tareo,
      };
    });
    this.monthSelect = arrayDays;
  }

  changeMonth(flag: number) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, 'month');
      this.getTareoByWorker(prevDate.format('YYYY'), prevDate.format('MM'))
    } else {
      const nextDate = this.dateSelect.clone().add(1, 'month');
      this.getTareoByWorker(nextDate.format('YYYY'), nextDate.format('MM'));
    }
  }

  clickDay(item: any) {
    const body = {
      ...item,
      worker: this.worker
    }
    const myModal = this.modalService.create({
      // @ts-ignore
      nzTitle: null,
      nzContent: TareoFormComponent,
      nzFooter: null,
      nzNoAnimation: true,
      nzWidth: 400,
      nzComponentParams: { item: body }
    });
    myModal.afterClose.subscribe((result) => {
      if(result.edit && result.edit == true) this.getTareoByWorker(item.currentDate.year, item.currentDate.month)
    })
  }

  close () {
    this.modalRef.close()
  }

  // reports
  generateReport() {
    let newWorker = JSON.parse(JSON.stringify(this.worker)) as Worker;
    newWorker.tareos[0].tareo.map(t => {
      t.iWeekDay =  moment(`${newWorker.tareos[0].year}-${newWorker.tareos[0].month}-${t.day <= 9 ? `0${t.day}` : t.day + ''} 06:00`).isoWeekday();
      t.week = this.week[t.iWeekDay - 1].split('')[0];
      t.state = t.state || '-'
    })
    // newWorker.name.split(' ').join('-')
    // this.pdfService.create(newWorker, this.today).pipe(take(1)).subscribe()
    this.router.navigateByUrl('/pdf', { state: newWorker });
  }
}
