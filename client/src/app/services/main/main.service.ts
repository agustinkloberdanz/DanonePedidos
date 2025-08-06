import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  //webAPI
  public baseRoute: string;
  
  constructor(public http: HttpClient) {
    this.baseRoute = "https://danonepedidos-g9cud5emethqescx.brazilsouth-01.azurewebsites.net/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}

