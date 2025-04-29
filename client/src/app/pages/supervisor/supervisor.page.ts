import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDTO } from 'src/app/models/productDTO';
import { ProductsService } from 'src/app/services/products/products.service';
import { AlertTools } from 'src/app/tools/AlertTools';
import { listOfProducts } from 'src/app/listOfProducts';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.page.html',
  styleUrls: ['./supervisor.page.scss'],
})
export class SupervisorPage {

  constructor(private router: Router, private productsService: ProductsService, private tools: AlertTools) { }

  data: any[] = []

  product: ProductDTO = new ProductDTO()

  isProductModalOpen: boolean = false

  async ionViewWillEnter() {
    await this.listProducts()
  }

  createOrderPage() {
    this.router.navigateByUrl('create-order')
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
          await this.listProducts()
        }
        await this.tools.dismissLoading();
      },
      async (error) => {
        await this.tools.presentToast('¡Error al eliminar producto!', 1500, 'light');
        await this.tools.dismissLoading();
      }
    )
  }

  async listProducts() {

    // Cargar productos desde json local
    // this.data = listOfProducts.map(item => ({
    //   name: item.brand.name,
    //   products: item.brand.products.map(product => ({
    //     brand: product.brand,
    //     description: product.description,
    //     sku: product.sku,
    //     imageUrl: product.imageUrl
    //   }))
    // }));

    // Cargar productos desde el servicio
      await this.tools.presentLoading('Cargando productos...')
      this.productsService.getAllByBrand().subscribe(
        async (res: any) => {
          if (res.statusCode != 200) {
            await this.tools.presentToast('Error al cargar los productos', 2000, 'danger');
          } else {
            this.data = res.model;
          }
          await this.tools.dismissLoading();
        }, async (error) => {
          await this.tools.dismissLoading();
          await this.tools.presentToast('Error en el servidor', 2000, 'danger');
        }
      )
  }

}
