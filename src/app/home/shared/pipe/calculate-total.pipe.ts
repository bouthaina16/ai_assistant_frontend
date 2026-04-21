import { Pipe, PipeTransform } from '@angular/core';
import {AbstractControl} from "@angular/forms";

@Pipe({
  name: 'calculateTotal',
  standalone: true,
  pure: false
})
export class CalculateTotalPipe implements PipeTransform {

  transform(product: AbstractControl, withTva: boolean): number {
    const quantity = product.get('quantity')?.value;
    const unitPrice = product.get('unitPrice')?.value;
    const discount = product.get('discount')?.value;
    const tva = product.get('tva')?.value;
    const totalWithoutTva = (unitPrice - (unitPrice * discount / 100))*quantity;
    const totalWithTva = totalWithoutTva + (totalWithoutTva * tva / 100);

    return withTva ? totalWithTva : totalWithoutTva;
  }

}
