import { Pipe, PipeTransform } from '@angular/core';
import {TransFormationEnum, TransformationModel} from "../../station/transformation/transformation.model";

@Pipe({
  name: 'paginationFormatter',
  standalone: true
})
export class PaginationPipe implements PipeTransform {

  transform(value: any[], currentPage: number): any[] {
    const neighbors = 1;
    const result: any[] = [];
    result.push(1);
    if (currentPage - neighbors > 2) {
      result.push('--');
    }

    for (let i = Math.max(2, currentPage - neighbors); i <= Math.min(value.length - 1, currentPage + neighbors); i++) {
      result.push(i);
    }

    if (currentPage + neighbors < value.length - 1) {
      result.push('--');
    }

    if (value.length > 1) {
      result.push(value.length);
    }
    return result;
  }

}
