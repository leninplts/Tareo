import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-tareo-form',
  templateUrl: './tareo-form.component.html',
  styleUrls: ['./tareo-form.component.scss']
})
export class TareoFormComponent implements OnInit {
  @Input() tareo: any;
  formGroup: FormGroup;
  constructor(
    private modalRef: NzModalRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log(this.tareo);
    this.initializeForm()
    this.fillFormValue();
  }

  initializeForm() {
    this.formGroup = this.formBuilder.group({
      stateId: new FormControl(0, [Validators.min(1), Validators.required]),
      note: new FormControl('', []),
    })
  }

  fillFormValue() {
    this.formGroup.patchValue({
      stateId: this.tareo.state.id,
      note: this.tareo.data.note
    })
  }

  onCancel() {
    this.modalRef.close()
  }

  onSave() {
    console.log(this.formGroup);
  }

}
