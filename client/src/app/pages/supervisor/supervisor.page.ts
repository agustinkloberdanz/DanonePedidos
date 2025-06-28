import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDTO } from 'src/app/models/productDTO';
import { ProductService } from 'src/app/services/products/product.service';
import { AlertTools } from 'src/app/tools/AlertTools';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage {

  constructor(private router: Router, private productsService: ProductService, private tools: AlertTools, private userService: UserService) { }

  data: any[] = []

  product: ProductDTO = new ProductDTO()

  isProductModalOpen: boolean = false

  async ionViewWillEnter() {
    await this.getData()
  }

  async getData() {
    await this.tools.presentLoading();

    this.userService.getData().subscribe(
      async (res: any) => {
        if (res.statusCode != 200) this.router.navigateByUrl('login')
        else if (res.model.role != 0) this.router.navigateByUrl('home')
        else await this.getAllProducts()

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.logout()
      }
    )
  }

  async getAllProducts() {
    await this.tools.presentLoading();

    this.productsService.getAllByBrand().subscribe(
      async (res: any) => {
        if (res.statusCode != 200) this.router.navigateByUrl('login')
        else this.data = res.model

        await this.tools.dismissLoading()
      },
      async (err) => {
        await this.tools.logout()
      }
    )
  }

  openAddProductModal() {
    this.product = new ProductDTO()
    this.isProductModalOpen = true
  }

  openUpdateProductModal(product: ProductDTO) {
    this.product = product
    this.isProductModalOpen = true
  }

  async deleteproductActionButton(product: ProductDTO) {
    const alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel delete product')
        }
      },
      {
        text: 'Eliminar',
        role: 'confirm',
        handler: () => this.deleteProduct(product)
      },
    ];

    await this.tools.presentAlert(
      'Eliminar producto',
      `El producto ${product.sku} se eliminará de manera permanente.`,
      alertButtons
    )
  }

  async deleteProduct(product: ProductDTO): Promise<void> {
    await this.tools.presentLoading(`Eliminando producto ${product.sku}...`)

    this.productsService.delete(product.id!).subscribe(
      async (res: any) => {
        if (res.statusCode != 200) {
          await this.tools.presentAlert('Etkilla', res.message, ['Aceptar']);
        } else {
          await this.getAllProducts()
        }
        await this.tools.dismissLoading();
      },
      async (error) => {
        await this.tools.presentToast('¡Error al eliminar producto!', 1500, 'light');
        await this.tools.dismissLoading();
      }
    )
  }

  async homePage() {
    await this.router.navigateByUrl('home')
  }
}
