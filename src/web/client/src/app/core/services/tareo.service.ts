import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareoService {

  private apiUrl = environment.apiUrl
  constructor(
    private httpClient: HttpClient
  ) { }
  public create(body: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}tareo`, body)
  }
  public getTareo(id: number, year: number, month: number): Observable<any> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.httpClient.get<any>(`${this.apiUrl}tareo/${id}`, { params })
  }
  public getByUser(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}items`)
  }
  public update(id: number, product: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiUrl}items/${id}`, product)
  }
  public updateTareo(id: number, body: any): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiUrl}tareo/${id}`, body)
  }
}
