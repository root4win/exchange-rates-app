import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl;
  private apiKey  = environment.apiKey;
  constructor(
    private http: HttpClient
  ) { }


  get<T>(endpoint: string, params?:any, apiKey?: string ): Observable<T> {
    let httpParams = new HttpParams();

    if(params) {
      Object.keys(params).forEach(key =>{
        if(params[key] !== undefined && params[key] !== null){
          httpParams = httpParams.set(key, params[key]);
        }
      })

      return this.http.get<T>(this.baseUrl + endpoint, { params: httpParams } );
    }

    if (apiKey){
      return this.http.get<T>(this.baseUrl + endpoint + this.apiKey );
    }

    return this.http.get<T>(this.baseUrl + endpoint);
  }
}
