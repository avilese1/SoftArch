import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})

export class PatientFormComponent {

  patientForm = new FormGroup({
    fiber: new FormControl(''),
    fat: new FormControl(''),
    carbs: new FormControl(''),
    calories: new FormControl(''),
    date: new FormControl(''),
    activitydesc: new FormControl(''),
    activitycal: new FormControl(''),
    symptomdesc: new FormControl(''),
    glucose: new FormControl(''),
  });

  onSubmit() {
    console.warn(this.patientForm.value);
  }
}
