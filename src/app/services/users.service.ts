import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { take,from, fromEventPattern, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user-profile';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { user } from '@angular/fire/auth';
import { format } from 'path';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  get allUsers$(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);

    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }

  constructor(
    private firestore: Firestore,
    private authService: AuthenticationService,
    private db: AngularFirestore
  ) {}

  addUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  searchPhone$(phone: number) {
    return this.db
      .collection('users', (ref) => ref.where('phone', '>=', phone))
      .valueChanges();
  }

  getUser(uid:string){
    return this.db.collection('users').doc(uid).valueChanges().pipe(take(1))
  }

  sendNotification(from: any, to: any) {
    if (from?.notification == undefined) from.notification = [];
    if (to?.notification == undefined) to.notification = [];

    let payload = {
      from: from.uid,
      to: to.uid,
      type: 'friend',
      name: from.displayName,
    };
    to.notification.push(payload);

    this.db.collection('users').doc(to.uid).update({
      notification: to.notification,
    });
  }

  denyFriendRequest(payload:any,userId:string){
    // console.log(userId,payload)
    this.db.collection('users').doc(userId).update({
      notification:payload
    })
  }
  acceptFriendRequest(currentUser:any,user:any){
    if(!currentUser.friends) currentUser.friends = []
    if(!user.friends) user.friends = []
    
    currentUser.friends.push({
      uid:user.uid,
      type:'friend'
    })
    user.friends.push({
      uid:currentUser.uid,
      type:'friend'
    })
    // console.log(currentUser,user)
    // console.log(currentUser)
    this.db.collection('users').doc(currentUser.uid).update({
      friends:currentUser.friends
    })
    this.db.collection('users').doc(user.uid).update({
      friends:user.friends
    })

  }

  friendRequest(accept: boolean, currentUser: any, user: any, index: number) {
    
    if (accept) {
      let temp = {...currentUser.notification};
      // this.acceptFriendRequest(currentUser,user);
      currentUser.notification.splice(index, 1);
      this.denyFriendRequest(currentUser.notification,currentUser.uid)
      return {data:temp}
    }else{
      currentUser.notification.splice(index, 1);
      this.denyFriendRequest(currentUser.notification,currentUser.uid)
      return null;

    }
    

    // user.notification
  }

  updateUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
