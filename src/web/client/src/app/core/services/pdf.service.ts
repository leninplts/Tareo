import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import * as crypto from 'crypto-js';
import * as saveAs from "file-saver"
import { Observable, map } from "rxjs"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private apiUrl = environment.apiUrl
  constructor(
    private httpClient: HttpClient
  ) { }
  public create(body: any, today: Date): Observable<any> {
    const encrypted = crypto.AES.encrypt(JSON.stringify(body), 'secretKey').toString();
    const params = new HttpParams()
    .set('worker', encrypted)
    return this.httpClient.get(`${this.apiUrl}pdf`, { params, responseType: 'blob'}).pipe(
      map((result:Blob) => {
        saveAs(result, `${body.name.split(' ').join('-')}-${body.dni}-${today.getTime()}.pdf`);
        return result;
      }));
  }
}