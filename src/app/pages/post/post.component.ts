import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PostService } from 'src/app/services/post.service';
import { UsersService } from 'src/app/services/users.service';
import { CreatePostComponent } from './components/create-post/create-post.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  posts: any[] = [];
  user!: ProfileUser;
  subs: Subscription[] = [];
  public currentUser$: Observable<any>;

  constructor(
    private postService: PostService,
    private authService: AuthenticationService,
    private router: Router,
    private userSer: UsersService,
    public dialog: MatDialog
  ) {
    this.currentUser$ = this.userSer.currentUserProfile$;
    this.currentUser$.subscribe((data) => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.subs.push(
      this.postService.getAllPosts().subscribe((posts) => {
        this.posts = posts;
      })
    );
  }

  openCreatePost() {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      data: { postingUser: this.user },
      panelClass: 'custom-dialog-container',
    });
  }

  postMessage(form: NgForm): void {
    const { message } = form.value;

    console.log(this.user);
    // this.postService.postMessage(message, `${this.user.firstName} ${this.user.lastName}`,{
    //   photoURL: this.user.photoURL,
    //   lastName: this.user.lastName,
    //   firstName: this.user.firstName
    // })
    this.postService.postMessage(message, this.user);
    form.resetForm();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
