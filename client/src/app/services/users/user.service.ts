import { Injectable } from '@angular/core';
import { MainService } from '../main/main.service';
import { RegisterDTO } from 'src/app/models/registerDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService extends MainService {

  register(registerDTO: RegisterDTO) {
    return this.http.post(`${this.baseRoute}Users/register`, registerDTO);
  }

  getData() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(`${this.baseRoute}Users/data`, { headers });
  }
}
