import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { serverTimestamp } from 'firebase/firestore';
import { Observable, switchMap } from 'rxjs';

import { ProfileUser } from 'src/app/models/user-profile';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {
  user!: ProfileUser;
  imageSrc: string[] = [];
  imageFile: File[] = [];
  filepath: string[] = [];
  constructor(
    private postService: PostService,
    private uploadSer: ImageUploadService,
    @Inject(MAT_DIALOG_DATA) public data: ProfileUser,
    public dialogRef: MatDialogRef<CreatePostComponent>
  ) {
    //console.log(data);
  }

  ngOnInit(): void {}
  async postMessage(form: NgForm) {
    const { message } = form.value;
    for (let index = 0; index < this.imageFile.length; index++) {
      let selectedUserId = this.data.uid;
      let filePath = `images/post/${selectedUserId}/${Date.now()}`;
      let link$: Observable<any> = await this.uploadSer.uploadImage(
        this.imageFile[index],
        filePath
      );
      await this.filepath.push(filePath);
    }
    // console.log(this.imageFile);
    this.postService.postMessage(message, this.data, this.filepath);

    form.resetForm();
    this.dialogRef.close();
  }
  readURL(event: any): void {
    if (event.target.files) {
      //console.log(event.target.files.length);
      for (let index = 0; index < event.target.files.length; index++) {
        this.imageFile.push(event.target.files[index]);
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[index]);
        reader.onload = (events: any) => {
          this.imageSrc.push(events.target.result as string);
        };
      }
      //console.log(this.imageSrc);
    }
  }
}
