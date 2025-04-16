import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  //webAPI
  public baseRoute: String;
  
  constructor(public http: HttpClient) {
    //localhost
    this.baseRoute = "http://localhost:5083/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}

