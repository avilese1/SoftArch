import {Component} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {VirgilCardCrypto, VirgilCrypto, VirgilPrivateKeyExporter} from "virgil-crypto";
import {CachingJwtProvider, CardManager, PrivateKeyStorage, VirgilCardVerifier} from "virgil-sdk";
// import "@babel/polyfill";
// import "@babel/preset-env";

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
    this.encrypt();
    console.warn(this.patientForm.value);
  }

  encrypt() {
    const virgilCrypto = new VirgilCrypto();
    const keys = virgilCrypto.generateKeys();
    const data = virgilCrypto.encrypt(this.patientForm.value.toLocaleString(), keys.publicKey);
    console.log("ENCRYPTED PATIENT DATA: " + data.toString('base64'));
  }

}
