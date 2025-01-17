import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})

export class AlertTools {
    constructor(
        private toastController: ToastController,
        private loadingController: LoadingController
    ) { }

    async presentToast(message: string) {
        await this.toastController.create({
            message: message,
            duration: 3500,
            position: 'bottom',
        }).then(res => res.present())
    }

    async makeLoadingAnimation() {
        const loading = await this.loadingController.create({
            spinner: 'circular',
            message: 'Cargando . . .'
        })

        loading.present()
    }

    async closeLoader() {
        this.checkAndCloseLoader()
        setTimeout(() => this.checkAndCloseLoader(), 3000)
    }

    async checkAndCloseLoader() {
        const loader = this.loadingController.getTop()

        if (loader !== undefined) {
            await this.loadingController.dismiss()
        }
    }
}