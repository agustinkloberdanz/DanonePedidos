import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { BrandDTO } from 'src/app/models/brandDTO';
import { ProductInCart } from 'src/app/models/product-in-cart';
import { ProductDTO } from 'src/app/models/productDTO';
import { ProductService } from 'src/app/services/products/product.service';
import { AlertTools } from 'src/app/tools/AlertTools';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.page.html',
  styleUrls: ['./create-order.page.scss'],
})
export class CreateOrderPage {

  constructor(private userService: UserService, private tools: AlertTools, private fb: FormBuilder, private router: Router, private productsService: ProductService) {
    this.quantityForm = this.fb.group(this.quantityFormJSON)
  }

  @ViewChild('quantityInput') quantityInput!: IonInput;

  async onWillPresent() {
    await this.quantityInput.setFocus();
  }

  listOfProducts: BrandDTO[] = []
  data: BrandDTO[] = []

  productToAdd: ProductInCart = new ProductInCart()
  errorMessage: string = 'Ingrese una cantidad válida'

  order: ProductInCart[] = []

  isOrderModalOpen: boolean = false
  isAddProductModalOpen: boolean = false
  canDismiss = false

  quantityForm: FormGroup
  quantityFormJSON: any = {
    quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
  }

  async ionViewWillEnter() {
    await this.getData()
    await this.listProducts()
  }

  async getData() {
    await this.tools.presentLoading();

    this.userService.getData().subscribe(
      async (res: any) => {
        if (res.statusCode != 200) await this.router.navigateByUrl('login')
        await this.tools.dismissLoading()
        if (localStorage.getItem('order') != '[]') await this.continueLastOrder()
      },
      async (err) => {
        await this.tools.logout()
      }
    )
  }

  async listProducts() {
    await this.tools.presentLoading('Cargando productos...')

    this.productsService.getAllByBrand().subscribe(
      async (res: any) => {
        if (res.statusCode != 200) await this.tools.presentToast('Error al cargar los productos', 2000, 'danger');
        else {
          this.listOfProducts = res.model;
          this.data = this.listOfProducts
        }
        await this.tools.dismissLoading();
      }, async (error) => {
        await this.tools.dismissLoading();
        await this.tools.presentToast('Error en el servidor', 2000, 'danger');
      }
    )
  }

  openAddProductModal(product: ProductDTO) {
    this.canDismiss = false
    this.productToAdd.product = { ...product }
    this.productToAdd.quantity = ''
    this.quantityForm = this.fb.group(this.quantityFormJSON)
    this.isAddProductModalOpen = true
  }

  closeAddProductModal() {
    this.canDismiss = true
    this.productToAdd.product!.description = ''
    this.productToAdd.quantity = ''
    this.productToAdd.product!.sku = ''
    this.quantityForm = this.fb.group(this.quantityFormJSON)
    this.isAddProductModalOpen = false
  }

  keyDownFunction(event: any) {
    if (event.keyCode === 13) {
      this.addProductToCart()
    }
  }

  addProductToCart() {
    if (this.quantityForm.valid) {
      const product: ProductInCart = {
        quantity: this.quantityForm.get('quantity')!.value,
        product: {
          sku: this.productToAdd.product!.sku,
          description: this.productToAdd.product!.description,
          id: this.productToAdd.product!.id,
          universalCode: this.productToAdd.product!.universalCode,
          imageUrl: this.productToAdd.product!.imageUrl,
          brand: this.productToAdd.product!.brand
        }
      }

      if (this.checkIsInOrder(product.product!)) {
        this.order[this.order.findIndex(item => item.product!.sku === product.product!.sku)].quantity = product.quantity!.replace(/\s+/g, '')
        this.tools.presentToast('Cantidad modificada')
      } else {
        this.order.push(product)
        this.tools.presentToast('Producto agregado al pedido')
      }

      this.closeAddProductModal()
      this.setOrder()
    }
  }

  async deleteProductActionButton(product: ProductDTO) {
    const buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Confirmar',
        role: 'confirm',
        handler: () => { this.deleteProductFromOrder(product) }
      }
    ]

    await this.tools.presentAlert('Alerta', `${product.description} será removido del pedido`, buttons)
  }

  deleteProductFromOrder(product: ProductDTO) {
    this.order = this.order.filter(item => item.product!.sku !== product.sku)
    this.tools.presentToast('Producto eliminado del pedido')
    this.setOrder()
  }

  modifyQuantity(product: ProductInCart) {
    this.openAddProductModal(product.product!)
    this.quantityForm.setValue({ 'quantity': product.quantity })
  }

  checkIsInOrder(product: ProductDTO): boolean {
    var flag = false
    this.order.map(item => { if (item.product!.sku === product.sku) flag = true })
    return flag
  }

  showCart() {
    this.isOrderModalOpen = true
  }

  closeCart() {
    this.isOrderModalOpen = false
  }

  copyOrder() {
    const order = this.generateStringFromArray(this.order)
    navigator.clipboard.writeText(order)
    this.tools.presentToast('Pedido copiado en portapapeles, simplemente péguelo en Whatsapp para enviarlo')
  }

  generateStringFromArray(array: ProductInCart[]) {
    return array.map(product => `${product.product!.sku} (${product.quantity}.`).join("\n");
  }

  async deleteOrderActionButton() {
    {
      const buttons = [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => { this.deleteOrder() }
        },
      ]

      await this.tools.presentAlert('Alerta', 'El pedido se borrará por completo', buttons)
    }
  }

  deleteOrder() {
    this.order = []
    this.closeCart()
    this.tools.presentToast('Pedido borrado')
    this.setOrder()
  }

  handleChange(e: any) {
    let filterBrand = e.detail.value
    if (filterBrand === 'all') this.data = [...this.listOfProducts]
    else {
      this.data = []
      this.listOfProducts.map(brand => { if (brand.name === filterBrand) this.data.push(brand) })
    }
  }

  showCencosudDates() {
    const date = new Date()
    var yogur = new Date()
    var dessert = new Date()

    yogur.setDate(date.getDate() + 14)
    dessert.setDate(date.getDate() + 4)

    alert(`Hoy sacamos\nYogures y leches: ${yogur.getDate()}/${yogur.getMonth() + 1}\nPostres y quesos: ${dessert.getDate()}/${dessert.getMonth() + 1}`)
  }

  getQuantity(product: ProductDTO) {
    var quantity = ''
    this.order.map(item => { if (item.product!.sku === product.sku) { quantity = item.quantity || '' } })
    return quantity
  }

  setOrder() {
    localStorage.setItem('order', JSON.stringify(this.order))
  }

  getOrder(): ProductInCart[] {
    let order = JSON.parse(localStorage.getItem('order')!)
    if (order) return order
    else return []
  }

  async continueLastOrder() {
    const buttons = [
      {
        text: 'Borrar',
        role: 'cancel',
        handler: () => { this.deleteOrder() }
      },
      {
        text: 'Continuar',
        role: 'confirm',
        handler: () => { this.order = this.getOrder() }
      },
    ]

    await this.tools.presentAlert('Alerta', 'Hay un pedido en progreso!\n¿Desea borrarlo o continuarlo?', buttons)
  }

  homePage() {
    this.router.navigateByUrl('home')
  }
}
