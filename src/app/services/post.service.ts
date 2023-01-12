import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import * as firebase from 'firebase/compat';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { serverTimestamp } from 'firebase/firestore';

import { map, Observable } from 'rxjs';
import { ProfileUser } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  currentUser!: ProfileUser;
  imageUrl!: string[];

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private firebaseStorage: AngularFireStorage
  ) {
    // this.afAuth.authState.subscribe(user => this.currentUser = user);
  }

  getAllPosts(): Observable<any> {
    return this.afs
      .collection<any>('posts', (ref) => ref.orderBy('time', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((item) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            };
          });
        })
      );
  }

  async postMessage(message: string, user: any, filepath: string[]) {
    //console.log(filepath);
    // let filePath = `images/post/${user.uid}/`;
    // for (let index = 0; index < filepath.length; index++) {
    //   let storageRef = this.firebaseStorage.storage
    //     .ref()
    //     .child(`${filepath[index]}`)
    //     .getDownloadURL()
    //     .then((urls) => {
    //       console.log(urls);
    //     });
    // }

    // const ref = this.firebaseStorage.storage.ref(filePath);
    // this.imageUrl.push(await ref.getDownloadURL());
    // console.log(this.imageUrl);
    this.afs
      .collection('posts')
      .add({
        message,
        title: `${user.firstName} ${user.lastName}`,
        user_id: user.uid,
        time: serverTimestamp(),
        avatar: user.photoURL,
        lastName: user.lastName,
        firstName: user.firstName,
        // imageUrl: this.imageUrl,
      })
      .then((res) => console.log(res));
  }
}
