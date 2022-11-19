import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
})
export class SearchDialogComponent implements OnInit {
  public users$!: Observable<any>;
  public currentUser$: Observable<any>;
  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSer: UsersService
  ) {
    this.users$ = this.userSer.searchPhone$(data.result);
    // this.users$.subscribe((data) => {
    //   console.log('data ne', data);
    // });
    this.currentUser$ = this.userSer.currentUserProfile$;
  }
  sendNotification(fromUser: any, toUser: any) {
    let result = fromUser.friends.findIndex(
      (currUser: any) => currUser.uid == toUser.uid
    );
    if (result == 0) alert('already friend');
    else {
      this.userSer.sendNotification(fromUser, toUser);
      this.dialogRef.close();
    }
    // console.log(result);
  }

  ngOnInit(): void {}
}
