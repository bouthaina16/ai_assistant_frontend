import { Pipe, PipeTransform } from '@angular/core';
import {TransFormationEnum, TransformationModel} from "../../station/transformation/transformation.model";

@Pipe({
  name: 'transformType',
  standalone: true
})
export class TransformTypePipe implements PipeTransform {

  transform(value: TransformationModel[], type: TransFormationEnum): TransformationModel[] {
    if (value && value.length > 0) {
      return value.filter(va => va.type === type);
    }
    return value;
  }

}
