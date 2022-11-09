import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private userSer:UsersService) { 

      console.log(data);
    }

    accept(user:any,index:number){
      
      this.dialogRef.close({
        accept:true,
        currentUser:this.data,
        user:user,
        userIndex:index
      })
    }

    deny(user:any,index:number){
      // this.userSer.friendRequest(false,this.data,user,index)
      this.dialogRef.close({
        accept:false,
        currentUser:this.data,
        user:user,
        userIndex:index
      })
    }

  ngOnInit(): void {
  }

}
