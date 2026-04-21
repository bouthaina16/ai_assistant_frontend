import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {BASE_URL, PRODUCT, STATION, TRANSFORMATION} from "../utils/url.constants";
import {StationModel, StationRequest} from "../home/station/station.model";
import {TransformationModel} from "../home/station/transformation/transformation.model";

@Injectable({
  providedIn: 'root'
})
export class TransformationService {

  constructor(private http: HttpClient) { }

  addTransformations(workStationPublicId: string, transformations: TransformationModel[]): Observable<StationModel> {
    return this.http.post<StationModel>(`${HOST}${BASE_URL}${STATION}${TRANSFORMATION}`, {
      transformations, workStationPublicId
    })
  }
}
