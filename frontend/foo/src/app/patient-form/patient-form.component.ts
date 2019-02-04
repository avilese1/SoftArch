import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})

export class PatientFormComponent {

  patientForm = new FormGroup({
    smbg: new FormControl(''),
    symptom: new FormControl(''),
    activity: new FormControl(''),
    diet: new FormControl(''),
  });

  onSubmit() {
    console.warn(this.patientForm.value);
  }
}
