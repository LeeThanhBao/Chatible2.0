import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DateDisplayPipe } from '../../pipes/date-display.pipe';
import { DatePipe } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';

// import { VideoCallComponent } from './components/video-call/video-call.component';

@NgModule({
  // declarations: [ChatComponent, VideoCallComponent],
  declarations: [
    ChatComponent,
    DateDisplayPipe,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [DatePipe],
})
export class ChatModule {}