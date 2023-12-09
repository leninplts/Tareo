import { statesDictionary } from 'src/app/features/models/state.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITareo, Worker } from 'src/app/features/interfaces/worker.interface';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit {
  worker: Worker;
  today: string = new Date().toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
  startDate: string
  endDate: string
  month: string
  week: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  statesDictionary = statesDictionary
  tareo: ITareo[];
  company = {
    name: 'M2H contratistas Generales SAC',
    date: new Date().toLocaleDateString(),
    ubication:
      'OTR.LOS BARRANCOS MZA. E LOTE. 13 OTR. ASOCIACIÓN LOS BARRANCOS (BARRANCOS)',
    report: {
      startDate: new Date().toLocaleDateString(),
      endDate: new Date().toLocaleDateString(),
    },
  };

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    console.log('pdf');
    this.worker = this.router.getCurrentNavigation()?.extras.state as Worker;
    this.tareo = this.worker.tareos[0].tareo
  }

  ngOnInit(): void {
    this.fillCounters()
    this.startDate = new Date(this.worker.tareos[0].year, this.worker.tareos[0].month - 1, 1).toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    this.endDate = new Date(this.worker.tareos[0].year, this.worker.tareos[0].month, 0).toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    this.month = new Date(this.worker.tareos[0].year, this.worker.tareos[0].month - 1, 1).toLocaleDateString('es-ES', { year:"numeric", month:"long"});
    console.log(this.startDate);
    console.log(this.endDate);
    console.log(this.month);
  }
  fillCounters() {
    console.log(this.worker);
    this.worker.tareos[0].tareo.forEach(t => {
      if(t.state == 'DL') ++this.workDayDetail.workedDays.value
      if(t.state == 'DD') ++this.workDayDetail.restDays.value
      if(t.state == 'FJ') ++this.workDayDetail.justifiedAbsenceDays.value
      if(t.state == 'FI') ++this.workDayDetail.unjustifiedAbsenceDays.value
      if(t.state == '') ++this.workDayDetail.noFilledDays.value
    })
  }
}
