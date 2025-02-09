import { Component } from '@angular/core';
import { listOfProducts } from '../../listOfProducts';
import { AlertTools } from 'src/app/tools/AlertTools';
import { ProductInCart } from 'src/app/models/product-in-cart';
import { Product } from 'src/app/models/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  listOfProducts: any = listOfProducts
  data: any

  productToAdd: ProductInCart = new ProductInCart()
  errorMessage: string = 'Ingrese una cantidad válida'

  order: ProductInCart[] = this.getOrder()

  isOrderModalOpen: boolean = false
  isAddProductModalOpen: boolean = false
  canDismiss = false

  quantityForm: FormGroup
  quantityFormJSON: any = {
    quantity: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
  }

  constructor(private tools: AlertTools, private fb: FormBuilder) {
    this.data = [...listOfProducts]
    this.quantityForm = this.fb.group(this.quantityFormJSON)
  }

  ionViewWillEnter() {
    console.log(this.data)
  }

  openAddProductModal(product: ProductInCart) {
    this.canDismiss = false
    this.productToAdd.description = product.description
    this.productToAdd.sku = product.sku
    this.productToAdd.quantity = ''
    this.quantityForm = this.fb.group(this.quantityFormJSON)
    this.isAddProductModalOpen = true
  }

  closeAddProductModal() {
    this.canDismiss = true
    this.productToAdd.description = ''
    this.productToAdd.quantity = ''
    this.productToAdd.sku = ''
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
        description: this.productToAdd.description,
        sku: this.productToAdd.sku
      }

      this.order.push(product)
      this.tools.presentToast('Producto agregado al pedido')
      this.closeAddProductModal()
      this.setOrder()
    }
  }

  deleteProduct(product: ProductInCart) {
    if (confirm(`¿Desea eliminar ${product.description} del pedido?`)) {
      this.order = this.order.filter(item => item.sku !== product.sku)
      this.tools.presentToast('Producto eliminado del pedido')
    }
    this.setOrder()
  }

  modifyQuantity(product: ProductInCart) {
    const quantity = prompt(`Modificar pedido\n${product.description} ${product.quantity} unidades\nNueva cantidad de unidades: `, product.quantity)
    if (quantity !== product.quantity && quantity !== null) {
      if (quantity !== '' && parseInt(quantity) > 0) {
        this.order[this.order.findIndex(item => item.sku === product.sku)].quantity = quantity.replace(/\s+/g, '')
        this.tools.presentToast('Cantidad modificada')
      }
      else this.tools.presentToast('Error - Ingrese una cantidad de unidades válida')
    }
    this.setOrder()
  }

  checkIsInOrder(product: Product): boolean {
    var flag = false
    this.order.map(item => { if (item.sku === product.sku) flag = true })
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
    return array.map(product => `${product.sku} (${product.quantity}.`).join("\n");
  }

  deleteOrder() {
    if (confirm('El pedido se borrará por completo')) {
      this.order = []
      this.closeCart()
      this.tools.presentToast('Pedido borrado')
    }
    this.setOrder()
  }

  handleChange(e: any) {
    const brand = e.detail.value
    if (brand === 'all') this.data = [...listOfProducts]
    else this.data = listOfProducts.filter(item => item.brand.name === brand)
  }

  showCencosudDates() {
    const date = new Date()
    var yogur = new Date()
    var dessert = new Date()

    yogur.setDate(date.getDate() + 14)
    dessert.setDate(date.getDate() + 4)

    alert(`Hoy sacamos\nYogures y leches: ${yogur.getDate()}/${yogur.getMonth() + 1}\nPostres y quesos: ${dessert.getDate()}/${dessert.getMonth() + 1}`)
  }

  getQuantity(product: Product) {
    var quantity = ''
    this.order.map(item => { if (item.sku === product.sku) { quantity = item.quantity } })
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
}
