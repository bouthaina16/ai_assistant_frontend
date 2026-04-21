import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string | undefined, limit: number): any {
    if(limit && value && value.length > limit) {
      return value.substring(0, limit).concat('...');
    }
    return value;
  }

}
