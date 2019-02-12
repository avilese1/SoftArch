import {Component} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {VirgilCardCrypto, VirgilCrypto, VirgilPrivateKeyExporter} from "virgil-crypto";
import {CachingJwtProvider, CardManager, PrivateKeyStorage, VirgilCardVerifier} from "virgil-sdk";
// import "@babel/polyfill";
// import "@babel/preset-env";
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})

export class PatientFormComponent {

  constructor(private httpService: HttpService) {
    httpService.print('got service')
  }

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
    const encryptedData = this.encrypt();
    console.log(this.patientForm.value);
    const serverURL = 'http://localhost:8080';
    console.log('client made');
    this.sendData(this.httpService, serverURL + '/', encryptedData)
    .subscribe(status => console.log(JSON.stringify(status)));
  }

  sendData(service, url, data) {
    console.warn('SENDING');
    return service.postData(url, data);
  }

  encrypt() {
    const virgilCrypto = new VirgilCrypto();
    const keys = virgilCrypto.generateKeys();
    const data = virgilCrypto.encrypt(this.patientForm.value.toLocaleString(), keys.publicKey);
    console.log("ENCRYPTED PATIENT DATA: " + data.toString('base64'));
    return data;
  }

}
