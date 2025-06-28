import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterDTO } from 'src/app/models/registerDTO';
import { AuthService } from 'src/app/services/auth/auth.service';
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

  constructor(private authService: AuthService, private tools: AlertTools, private userService: UserService, private router: Router) { }

  async ionViewWillEnter() {
    await this.getData()
  }

  async getData() {
    await this.tools.presentLoading();

    this.userService.getData().subscribe(
      async (res: any) => {
        if (res.statusCode == 200) this.router.navigateByUrl('home')
        else await this.tools.logout()

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.dismissLoading()
      }
    )
  }

  async register() {
    if (this.user.email == '' || this.user.firstName == '' || this.user.lastName == '' || this.user.password == '' || this.passwordCheck == '')
      await this.tools.presentToast('Alerta - Completa todos los campos', 2000)

    else {
      if (this.user.password !== this.passwordCheck) return await this.tools.presentAlert('Error', 'Las contraseñas no coinciden');
      else {
        await this.tools.presentLoading('Registrando usuario...');

        this.userService.register(this.user).subscribe(
          async (res: any) => {
            if (res.statusCode != 200) await this.tools.presentAlert('Error', res.message);

            else {
              await this.tools.presentToast('Usuario registrado correctamente', 2000, 'success');

              this.authService.login(this.user).subscribe(
                async (res: any) => {
                  if (res.statusCode != 200) await this.tools.presentAlert('Error', res.message);

                  else {
                    localStorage.setItem('Token', res.model)
                    this.router.navigateByUrl('home')
                  }

                  await this.tools.dismissLoading()
                },
                async (err) => {
                  await this.tools.presentAlert('Error', 'Error al iniciar sesión');
                  await this.tools.dismissLoading()
                }
              )
            }

            await this.tools.dismissLoading()
          },
          async (err) => {
            await this.tools.presentAlert('Error', 'Error al registrar el usuario');
            await this.tools.dismissLoading()
          }
        )
      }
    }
  }
}
