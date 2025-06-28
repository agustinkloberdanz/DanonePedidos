import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/userDTO';
import { UserService } from 'src/app/services/users/user.service';
import { AlertTools } from 'src/app/tools/AlertTools';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  user: UserDTO = new UserDTO()

  constructor(private router: Router, protected tools: AlertTools, private userService: UserService) { }

  async ionViewWillEnter() {
    await this.getData()
  }

  async getData() {
    await this.tools.presentLoading();

    this.userService.getData().subscribe(
      async (res: any) => {
        if (res.statusCode != 200) this.router.navigateByUrl('login')
        else this.user = res.model

        this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.logout()
      }
    )
  }

  async logout() {
    const buttons = [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Aceptar',
        role: 'confirm',
        handler: async () => {await this.tools.logout()}
      },
    ]

    await this.tools.presentAlert('Cerrar sesión', '¿Está seguro de que desea cerrar sesión?', buttons)
  }

  createOrderPage() { this.router.navigateByUrl('create-order') }

  supervisorPage() { this.router.navigateByUrl('supervisor') }

  myProfilePage() { this.router.navigateByUrl('my-profile') }
}