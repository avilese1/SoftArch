import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  postData(url: string, data, pkey) {
    console.log('In service');
    let retVal = null;
    const valet = {"valetkey": ""};
    this.http.post(url + "/publicKey", valet).subscribe(status => {
        const key = JSON.stringify(status).substr(12, 4);
        console.log(JSON.stringify(status));
        console.log(pkey);
        const keyvalet = {"valetkey": "" + key, "privatekey": pkey.toLocaleString()};
        console.log(keyvalet);
        this.http.post(url + "/publicKey", keyvalet).subscribe(status2 => {
          console.log(status2);
          const datacont = {"valetkey": "" + key, "data": data};
          this.http.post(url + "/data/add", datacont).subscribe(status => {
            console.log(JSON.stringify(status));
          });
        });
    });
    return retVal;
  }

  print(s: string) {
    console.log(s);
  }
  
  constructor(private http: HttpClient) { }
}


