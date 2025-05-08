import { Injectable } from '@angular/core';
import { MainService } from '../main/main.service';
import { AddProductDTO } from 'src/app/models/addProductDTO';
import { ProductDTO } from 'src/app/models/productDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends MainService {

  GetAll() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Products', { headers });
  }

  getAllByBrand() {
      var token = localStorage.getItem('Token');

      var headers = this.createHeader(token);

      return this.http.get(this.baseRoute + 'Products/getAllByBrand', { headers });
  }

  add(addProductDTO: AddProductDTO) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Products/add', addProductDTO, { headers });
  }

  update(product: ProductDTO) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Products/update', product, { headers });
  }

  delete(id: number) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + `Products/delete/${id}`, { headers });
  }
}
