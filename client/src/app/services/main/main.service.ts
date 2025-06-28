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
    // this.baseRoute = "https://localhost:7010/api/";

    //webAPI
    this.baseRoute = "https://danone-client20250627165225-atgmfddbh4cehdeg.brazilsouth-01.azurewebsites.net/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}

