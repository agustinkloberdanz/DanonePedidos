import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDTO } from 'src/app/models/userDTO';
import { UserService } from 'src/app/services/users/user.service';
import { AlertTools } from 'src/app/tools/AlertTools';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage {

  user: UserDTO = new UserDTO()

  arefieldsDisabled: boolean = true

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

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.logout()
      }
    )
  }

  modifyFields() { this.arefieldsDisabled = !this.arefieldsDisabled }

  async deleteUser() {
    await this.tools.presentLoading('Eliminando cuenta...')

    this.userService.delete(this.user.id).subscribe(
      async (res: any) => {
        if (res.statusCode != 200) await this.tools.presentToast('Error al eliminar la cuenta', 2000, 'danger')
        else {
          localStorage.clear()
          this.router.navigateByUrl('login')
        }

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.presentAlert('Error', 'Error al eliminar la cuenta')
        await this.tools.dismissLoading()
      }
    )
  }

  async deleteUserActionButton() {
    const buttons = [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Aceptar',
        role: 'confirm',
        handler: async () => { await this.deleteUser() }
      },
    ]

    await this.tools.presentAlert('Eliminar cuenta', '¿Está seguro de que desea eliminar su cuenta de manera permanente?', buttons)
  }

  async updateUser() {
    await this.tools.presentLoading('Actualizando datos...')
    this.userService.update(this.user).subscribe(
      async (res: any) => {
        if (res.statusCode != 200) await this.tools.presentToast(res.message, 2000, 'danger')
        else {
          await this.tools.presentToast('Cuenta actualizada correctamente', 2000, 'success')
          this.modifyFields()
        }

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.presentAlert('Error', 'Error al actualizar sus datos')
        await this.tools.dismissLoading()
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
        handler: async () => { await this.tools.logout() }
      },
    ]

    await this.tools.presentAlert('Cerrar sesión', '¿Está seguro de que desea cerrar sesión?', buttons)
  }

  homePage() {
    this.router.navigateByUrl('home')
  }
}