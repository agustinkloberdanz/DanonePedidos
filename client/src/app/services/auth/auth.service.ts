import { Injectable } from '@angular/core';
import { MainService } from '../main/main.service';
import { LoginDTO } from 'src/app/models/loginDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends MainService {

  login(loginDTO: LoginDTO) {
    return this.http.post(`${this.baseRoute}auth/login`, loginDTO)
  }
}
