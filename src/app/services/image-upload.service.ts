import { HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { from, Observable, switchMap } from 'rxjs';
import {} from 'http';
@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(public storage: Storage, private http: HttpClient) {}

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
  downloadFile(link: any): Observable<any> {
    return this.http.get(link);
  }
}
