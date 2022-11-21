import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import * as firebase from 'firebase/compat';
import { serverTimestamp } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { ProfileUser } from '../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  currentUser!: ProfileUser;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { 

      // this.afAuth.authState.subscribe(user => this.currentUser = user);
  }

  getAllPosts(): Observable<any> {
    return this.afs.collection<any>('posts', ref => ref.orderBy('time', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(item => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            };
          });
        })
      );
  }

  postMessage(message: string,user: any): void {
    console.log(user.photoURL);
    this.afs.collection('posts').add({
      message,
      title: `${user.firstName} ${user.lastName}`,
      user_id: user.uid,
      time: serverTimestamp(),
      avatar: user.photoURL,
      lastName: user.lastName,
      firstName: user.firstName
    }).then(res => console.log(res));
  }
}
