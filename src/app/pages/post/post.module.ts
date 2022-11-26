import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CreatePostComponent } from './components/create-post/create-post.component';

@NgModule({
  declarations: [PostComponent, CreatePostComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
  ],
})
export class PostModule {}
