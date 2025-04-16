import { Injectable } from "@angular/core";
import { ToastController, LoadingController, AlertController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})

export class AlertTools {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  async presentAlert(header: string, message: string, buttons: any[] = ['OK']): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons
    });
    await alert.present();
  }

  async presentToast(message: string, duration: number = 2000, color: string = 'medium'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async presentLoading(message: string = 'Cargando...'): Promise<void> {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'crescent'
      });
      await this.loading.present();
    }
  }

  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}