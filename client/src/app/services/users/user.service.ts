import { Injectable } from '@angular/core';
import { MainService } from '../main/main.service';
import { RegisterDTO } from 'src/app/models/registerDTO';
import { UserDTO } from 'src/app/models/userDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService extends MainService {

  register(registerDTO: RegisterDTO) {
    return this.http.post(`${this.baseRoute}Users/register`, registerDTO);
  }

  update(userDTO: UserDTO) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(`${this.baseRoute}Users/update`, userDTO, { headers });
  }

  delete(id: number) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(`${this.baseRoute}Users/delete/${id}`, { headers });
  }

  getData() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(`${this.baseRoute}Users/data`, { headers });
  }
}
