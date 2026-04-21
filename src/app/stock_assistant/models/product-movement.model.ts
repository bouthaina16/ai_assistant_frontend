export type MovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT"
  | "SALE"
  | "TRANSFORMATION_INPUT"
  | "TRANSFORMATION_OUTPUT";

export interface ProductMovementModel {
  publicId: string;
  productPublicId: string;
  productName: string;
  movementType: MovementType;
  quantity: number;
  oldStock: number;
  newStock: number;
  sourceType: string;
  sourceReference?: string;
  movementDate: string;
  comment?: string;
  createdAt: string;
}

