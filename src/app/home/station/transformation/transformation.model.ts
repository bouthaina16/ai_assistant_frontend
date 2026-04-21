import {ProductModel} from "../../product/product.model";

export interface TransformationModel {
  productPublicId?: string;
  product?: ProductModel;
  publicId?: string;
  quantity: number;

  type?: TransFormationEnum;
}

export enum TransFormationEnum {
  INPUT="INPUT", OUTPUT="OUTPUT"

}
