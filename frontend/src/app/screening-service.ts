import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Helpservice } from './helpservice';
import { Observable, throwError } from 'rxjs';
import { APP_CONFIG_END_POINT } from './endpoint';
import { DataModelDTO, pwDecisionStatusDTO } from './model';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(private http: HttpClient,private helpService:Helpservice) {}

  private resolveLocalityId(): number | null {
    const loc: any = this.helpService.localityInfo?.() ?? null;
    const val = loc?.localityId ?? loc?.countySiteId ?? loc?.id;
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
   private buildHeaders(): HttpHeaders {
    const localityId = this.resolveLocalityId();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (localityId != null) {
      headers = headers
        .set('localityId', String(localityId))       // most common expected header
        .set('countySiteId', String(localityId));    // sometimes backend uses this name
    }

    // if your backend needs auth token header, add it here too
    const token = this.helpService.accessToken?.();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return headers;
  }


  getPollWorkers(): Observable<any[]> { 
    const localityName=this.helpService.localityInfo()?.localityName ??'';
    const url=`${APP_CONFIG_END_POINT.getPollWorkers}/${localityName}/1`;
    return this.http.get<any[]>(url);
    
  }
  /*
  getChildDataModels(datamodelId: number): Observable<any[]> { 
const url=`${APP_CONFIG_END_POINT.getChildDataModels}`;
  return this.http.get<any[]>(url+"/"+datamodelId);
  }*/
   getChildDataModels(datamodelId: number): Observable<DataModelDTO[]> {
    const url = `${APP_CONFIG_END_POINT.getChildDataModels}/${datamodelId}`;
    console.log('getChildDataModels URL =>', url);
    return this.http.get<DataModelDTO[]>(url);
  }



  getPWLoadData(applicationId: number): Observable<any> {
  const url = APP_CONFIG_END_POINT.getPWLoadData;
  return this.http.get<any>(url+"/"+applicationId);
}

 getChildQuestion(body: any): Observable<any> {
    const url = APP_CONFIG_END_POINT.getChildQuestion;
    return this.http.post<any>( url,body);
  }
 savePollWorker(body: any): Observable<any> {
    const url = APP_CONFIG_END_POINT.savePollWorker;
    return this.http.post<any>(url, body);
  }
  getInternalPollWorkerDecisionDetails(pollworkerId: number): Observable<any> {
    const url = `${APP_CONFIG_END_POINT.getInternalPollWorkerDecisionDetails}/${pollworkerId}`;
    console.log('getInternalPollWorkerDecisionDetails URL =>', url);
    return this.http.get<any>(url);
  }
/*
getPWDecisionStatuses(pwDecisionStatusId:number): Observable<any> {
const url = `${APP_CONFIG_END_POINT.getPWDecisionStatuses}/${pwDecisionStatusId}`;
console.log('getPWDecisionStatuses URL =>',url);
return this.http.get<any>(url);
}*/

  getPWDecisionStatuses(applicationId: number): Observable<pwDecisionStatusDTO[]> {
    const url = `${APP_CONFIG_END_POINT.getPWDecisionStatuses}/${applicationId}`;
    console.log('getPWDecisionStatuses URL =>', url);
    return this.http.get<pwDecisionStatusDTO[]>(url);
  }




}