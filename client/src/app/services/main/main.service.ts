import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  //webAPI
  public baseRoute: string;
  
  constructor(public http: HttpClient) {
    //localhost
    this.baseRoute = "https://localhost:7010/api/";

    //webAPI
    // this.baseRoute = "https://p4bnc6db-7010.brs.devtunnels.ms/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}

