import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TareoService } from 'src/app/core/services/tareo.service';
import { ITareo, Worker } from 'src/app/features/interfaces/worker.interface';
import { statesDictionary } from 'src/app/features/models/state.model';

@Component({
  selector: 'app-tareo-form',
  templateUrl: './tareo-form.component.html',
  styleUrls: ['./tareo-form.component.scss']
})
export class TareoFormComponent implements OnInit {
  @Input() item: any;
  statesDictionary = statesDictionary
  formGroup: FormGroup;
  worker: Worker;
  tareo: ITareo;
  constructor(
    private modalRef: NzModalRef,
    private formBuilder: FormBuilder,
    private tareoService: TareoService
  ) { }

  ngOnInit(): void {
    this.worker = this.item.worker
    this.tareo = this.item.detail
    this.initializeForm()
    this.fillFormValue();
  }

  initializeForm() {
    this.formGroup = this.formBuilder.group({
      stateId: new FormControl(0, [Validators.min(1), Validators.required]),
      note: new FormControl('', []),
      hours: new FormControl('', []),
    })
  }

  fillFormValue() {
    this.formGroup.patchValue({
      stateId: this.tareo.state ?? 0,
      note: this.tareo.note,
      hours: this.tareo.hours,
    })
  }

  onCancel() {
    this.modalRef.close({ edit: false })
  }

  onSave() {
    this.worker.tareos[0].tareo.map((t: ITareo) => {
      if(t.day == this.tareo.day) {
        t.state = this.formGroup.getRawValue().stateId ?? '',
        t.note = this.formGroup.getRawValue().note ?? '',
        t.hours = this.formGroup.getRawValue().hours ?? ''
      }
    })
    let body = {
      workerId: this.worker.id,
      year: this.item.currentDate.year,
      month: this.item.currentDate.month,
      tareo: JSON.stringify(this.worker.tareos[0].tareo),
    }
    this.tareoService.updateTareo(this.worker.tareos[0].id, body).subscribe(
      res => this.modalRef.close({ edit: true })
    )
  }

}
