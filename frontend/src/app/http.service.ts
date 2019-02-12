import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {

  postData(url: string, data): Observable<any> {
    console.log('In service');
    return this.http.post(url, data);
  }

  print(s: string) {
    console.log(s);
  }
  
  constructor(private http: HttpClient) { }
}


