import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileUser } from 'src/app/models/user-profile';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  user!: ProfileUser;
  constructor(
    private postService: PostService,
    @Inject(MAT_DIALOG_DATA) public data: ProfileUser,
    public dialogRef: MatDialogRef<CreatePostComponent>
  ) {
    //console.log(data);
  }

  ngOnInit(): void {}
  async postMessage(form: NgForm) {
    const { message } = form.value;

    console.log(this.data);
    // this.postService.postMessage(message, `${this.user.firstName} ${this.user.lastName}`,{
    //   photoURL: this.user.photoURL,
    //   lastName: this.user.lastName,
    //   firstName: this.user.firstName
    // })
    await this.postService.postMessage(message, this.data);
    form.resetForm();
    this.dialogRef.close();
  }
}
