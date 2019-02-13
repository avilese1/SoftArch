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
    const virgilCrypto = new VirgilCrypto();
    const keys = virgilCrypto.generateKeys();
    const encryptedData = this.encrypt(virgilCrypto, keys);

    console.log(virgilCrypto.exportPrivateKey(keys.privateKey));
    console.log(virgilCrypto.importPrivateKey(virgilCrypto.exportPrivateKey(keys.privateKey)));
    console.log(keys.privateKey);
    console.log(this.patientForm.value);
    const serverURL = 'http://localhost:8080';
    this.sendData(serverURL, encryptedData, virgilCrypto.exportPrivateKey(keys.privateKey));
  }

  sendData(url, data, pkey) {
    console.warn('SENDING');
    return this.httpService.postData(url, data, pkey);
  }

  encrypt(virgil, keys) {
    const data = virgil.encrypt(JSON.stringify(this.patientForm.value), keys.publicKey);
    console.log("ENCRYPTED PATIENT DATA: " + data.toString('base64'));
    console.log(virgil.decrypt(data, keys.privateKey));
    return data;
  }

}
