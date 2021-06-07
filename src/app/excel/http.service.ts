import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  fetchData(){
    let token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX3R5cGVfaWQiOjIsImlhdCI6MTYyMzA0NjYxOCwiZXhwIjoxNjI4MjMwNjE4fQ.5AkH0eG7xm8IDhvAAxLY9AUhs71Om1TdVwPIVIlHEak';
    let headers=new HttpHeaders().append('x-access-token',token);
    let url='http://ytp.thelattice.org/ytp_quicksand/api/v2/participants_download';
    return this.http.get(url,{headers:headers});
  }

}
