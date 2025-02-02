import { Component } from '@angular/core';
import { listOfProducts } from '../../listOfProducts';
import { AlertTools } from 'src/app/tools/AlertTools';
import { ProductInCart } from 'src/app/models/product-in-cart';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  listOfProducts: any = listOfProducts
  data: any

  order: ProductInCart[] = this.getOrder()

  isOrderModalOpen: boolean = false
  canDismiss = false

  constructor(private tools: AlertTools) {
    this.data = [...listOfProducts]
  }

  ionViewWillEnter() {
    console.log(this.data)
  }

  addProduct(product: ProductInCart) {
    const quantity = prompt(`${product.description}\nCantidad de unidades`)
    if (quantity !== null) {
      if (quantity !== '' && parseInt(quantity) > 0) {
        product.quantity = quantity.replace(/\s+/g, '')
        this.order.push(product)
        this.tools.presentToast('Producto agregado al pedido')
      } else {
        this.tools.presentToast('Error - Ingrese una cantidad de unidades válida')
      }
    }
    this.setOrder()
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
    this.canDismiss = false
    this.isOrderModalOpen = true
  }

  closeCart() {
    this.canDismiss = true
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
