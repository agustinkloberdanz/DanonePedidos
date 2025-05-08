import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDTO } from 'src/app/models/loginDTO';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';
import { AlertTools } from 'src/app/tools/AlertTools';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  user: LoginDTO = new LoginDTO();

  constructor(private tools: AlertTools, private userService: UserService, private router: Router, private authService: AuthService) { }

  async ionViewWillEnter() {
    await this.getData()
  }

  async getData() {
    await this.tools.presentLoading();

    this.userService.getData().subscribe(
      async (res: any) => {
        if (res.statusCode == 200) this.router.navigateByUrl('home')
        else localStorage.clear()

        await this.tools.dismissLoading()
      }, 
      async (err) => {
        localStorage.clear()
        await this.tools.dismissLoading()        
      }
    )
  }

  async login() {
    await this.tools.presentLoading('Iniciando sesión...');

    this.authService.login(this.user).subscribe(
      async (res: any) => {
        if (res.statusCode != 200) await this.tools.presentToast(res.message, 2000);

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

}
