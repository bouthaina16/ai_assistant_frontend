import {TransformationModel} from "./transformation/transformation.model";

export interface StationModel {
  publicId: string;
  name: string;
  operator: string;
  date: string;
  duration: number;
  machine: string;
  closed: boolean;
  reference: string;
  transformations: TransformationModel[];
}

export interface StationResponse {
  stations: StationModel[];
  count: number;
}

export interface StationRequest {
  provider: string;
  name: string;
  initialValue: number;
  publicId?: string;
}

export interface SearchStationModel {
  name?: string;
  page: number;
}

