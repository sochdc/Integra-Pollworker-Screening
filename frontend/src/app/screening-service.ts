import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Helpservice } from './helpservice';
import { Observable } from 'rxjs';
import { APP_CONFIG_END_POINT } from './endpoint';

@Injectable({
  providedIn: 'root',
})
export class ScreeningService {
  
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(private http: HttpClient,private helpService:Helpservice) {}

  getPollWorkers(): Observable<any[]> { 
    const localityName=this.helpService.localityInfo()?.localityName ??'';
    const url=`${APP_CONFIG_END_POINT.getPollWorkers}/${localityName}/1`;
    return this.http.get<any[]>(url);
    
  }
  getPWLoadData(applicationId: number): Observable<any> {
  const url = APP_CONFIG_END_POINT.getPWLoadData;
  return this.http.get<any>(url+"/"+applicationId);
}
/*

getChildQuestion(pwQuestionOptionId: number): Observable<any> {
  const url = APP_CONFIG_END_POINT.getChildQuestion;
  return this.http.get<any>(url+"/"+ pwQuestionOptionId);
}*/


getChildQuestion(pwQuestionOptionId: number): Observable<any> {
  return this.http.get<any>(`${APP_CONFIG_END_POINT.getChildQuestion}/${pwQuestionOptionId}`);
}
/*
getChildQuestion(pwQuestionOptionId: number): Observable<any> {
  const base = APP_CONFIG_END_POINT.getChildQuestion;
  const finalUrl = `${base}/${pwQuestionOptionId}`;

  console.log('CHILD FINAL URL =>', finalUrl);

  return this.http.get<any>(finalUrl);
}*/

}