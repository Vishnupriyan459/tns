import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  API = "http://localhost:8080";

  public registerCertificate(certificateData: any) {
    return this.http.post(`${this.API}/certificates`, certificateData);
  }

  public getCertificates() {
    return this.http.get(`${this.API}/certificates`);
  }

  public deleteCertificate(certificateId: any) {
    return this.http.delete(`${this.API}/certificates/${certificateId}`);
  }

  public updateCertificate(certificate: any) {
    return this.http.put(`${this.API}/certificates/${certificate.id}`, certificate);
  }

  constructor(private http: HttpClient) { }
}
