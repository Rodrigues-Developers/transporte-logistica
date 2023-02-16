import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less'],
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      nfe: ['', Validators.required],
      emissionDate: ['', Validators.required],
      transport: ['', Validators.required],
      departureDate: ['', Validators.required],
      arrivalForecast: ['', Validators.required],
      merchandise: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      nfValue: [
        '',
        [Validators.required, Validators.pattern('[0-9]+(.[0-9]{1,2})?')],
      ],
      pinRelease: ['', Validators.required],
      obs: [''],
    });
  }
  onSubmit() {
    //Send Changes
  }

  ngOnInit() {}
}
