import { Component, input, OnInit, output } from '@angular/core';
import { ProductDTO } from 'src/app/models/productDTO';
import { AddProductDTO } from 'src/app/models/addProductDTO';
import { ModalController } from '@ionic/angular';
import { AlertTools } from 'src/app/tools/AlertTools';
import { ProductService } from 'src/app/services/products/product.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {

  constructor(private modalController: ModalController, private tools: AlertTools, private productsService: ProductService) { }

  ngOnInit(): void {
    if (this.product()?.sku) {
      this.formModel = { ...this.product(), id: this.product()?.id ?? 0 }
      this.type = 'update'
    } else {
      this.formModel = new AddProductDTO()
      this.type = 'add'
    }
  }

  type: string = ''

  product = input<ProductDTO>()
  confirm = output<string>()

  formModel: ProductDTO | AddProductDTO

  async closeModal() {
    await this.modalController.dismiss()
  }

  async submit() {
    if (this.type == 'add') await this.addProduct()
    if (this.type == 'update') await this.updateProduct()
  }

  async addProduct() {
    if (this.validateFields()) {
      await this.tools.presentLoading('Agregando nuevo producto...')

      this.productsService.add(this.formModel as AddProductDTO).subscribe(
        async (res: any) => {
          if (res.statusCode != 200) {
            await this.tools.presentAlert('Danone', res.message, ['Aceptar']);
            await this.tools.presentToast('Error al agregar nuevo producto', 2000, 'danger');
          } else {
            this.confirm.emit('')
            await this.tools.presentToast('Producto agregado correctamente', 2000, 'success');
            await this.closeModal()
          }
          await this.tools.dismissLoading();
        }, (error) => {
          this.tools.dismissLoading();
          this.tools.presentToast('Error en el servidor', 2000, 'danger');
        })
    } else {
      this.tools.presentToast('Por favor, llena todos los campos correctamente', 2000, 'danger');
    }
  }

  async updateProduct() {
    if (this.validateFields()) {
      await this.tools.presentLoading('Agregando nuevo producto...')

      this.productsService.update(this.formModel as ProductDTO).subscribe(
        async (res: any) => {
          if (res.statusCode != 200) {
            await this.tools.presentAlert('Danone', res.message, ['Aceptar']);
            await this.tools.presentToast('Error al modificar producto', 2000, 'danger');
          } else {
            this.confirm.emit('')
            await this.tools.presentToast('Producto modificado correctamente', 2000, 'success');
            await this.closeModal()
          }
          await this.tools.dismissLoading();
        }, (error) => {
          this.tools.dismissLoading();
          this.tools.presentToast('Error en el servidor', 2000, 'danger');
        })
    } else {
      this.tools.presentToast('Por favor, llena todos los campos correctamente', 2000, 'danger');
    }
  }

  validateFields() {
    if (this.formModel.brand == '' || this.formModel.sku == '' || this.formModel.description == '' || this.formModel.universalCode == '') {
      return false
    } else {
      return true
    }
  }
}
