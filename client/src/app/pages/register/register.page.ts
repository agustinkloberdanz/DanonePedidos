import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterDTO } from 'src/app/models/registerDTO';
import { UserService } from 'src/app/services/users/user.service';
import { AlertTools } from 'src/app/tools/AlertTools';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  user: RegisterDTO = new RegisterDTO();
  passwordCheck: string = '';

  constructor(private tools: AlertTools, private userService: UserService, private router: Router) { }

  async register() {
    if (this.user.password !== this.passwordCheck) return await this.tools.presentAlert('Error', 'Las contraseñas no coinciden');

    await this.tools.presentLoading('Registrando usuario...');

    this.userService.register(this.user).subscribe(
      async (res: any) => {
        if (res.statusCode != 200) await this.tools.presentAlert('Error', res.message);

        else {
          await this.tools.presentToast('Usuario registrado correctamente', 2000, 'success');
          //make login
        }

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.presentAlert('Error', err.error.message);
        await this.tools.dismissLoading()
      }
    )
  }


}
