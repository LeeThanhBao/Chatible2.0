import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProfileUser } from '../models/user-profile';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  users!: Observable<ProfileUser[]>;
  user!: ProfileUser;
  items: ProfileUser[] = [];

  constructor(public db: AngularFirestore) {
    this.users = db.collection<ProfileUser>('users').valueChanges({ idField: 'uid' });
    this.users.subscribe((data) => {
      this.items = data;
    });
  }

  public getAllUser() {
    return this.users;
  }
  public getUser(uid: any) {
    console.log(uid);
    // this.db
    //   .collection<User>('users', (ref) => ref.where('uid', '==', uid))
    //   .get()
    //   .toPromise()
    //   .then((query) => {
    //     query.forEach((doc) => {
    //       this.user = doc.data();
    //       console.log(this.user);
    //     });
    //   });
    // return this.user;
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].uid == uid) {
        this.user = this.items[index];
      }
    }
  }
}
