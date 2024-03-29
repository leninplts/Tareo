import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private apiUrl = environment.apiUrl
  constructor(
    private httpClient: HttpClient
  ) { }
  public getAll(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}worker`)
  }
}
