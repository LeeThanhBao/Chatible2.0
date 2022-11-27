import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
// import { DomSanitizer } from '@angular/platform-browser';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import Peer from 'peerjs';

// import { VideoCallComponent } from './pages/chat/components/video-call/video-call.component';
// import { CallService } from 'src/app/services/call.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { DataService } from 'src/app/services/data.service';
// import { UsersService } from 'src/app/services/users.service';
// import { User } from 'src/app/models/user.model';

import { Message } from 'src/app/models/chat';
import { ProfileUser } from 'src/app/models/user-profile';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CallService } from 'src/app/services/call.service';
import { DataService } from 'src/app/services/data.service';
import { VideoCallComponent } from 'src/app/pages/chat/components/video-call/video-call.component';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  // peer: Peer;
  users: ProfileUser[] = [];
  chatUser!: ProfileUser;
  public user: any;
  public currentUser$: any = this.authService.currentUser$;
  // searchControl = new FormControl('');
  // messageControl = new FormControl('');
  // chatListControl = new FormControl('');

  // constructor(
  //   public auth: AuthService,
  //   public callService: CallService,
  //   public data: DataService,
  //   private diaLog: MatDialog,
  //   private usersService: UsersService,
  // ) {
  //   this.peer = new Peer();
  //   this.peer.on('open', (id) => console.log(id));
  // }

  // ngOnInit(): void {
  //   this.data.getAllUser().subscribe((data) => {
  //     this.users = data;
  //   });
  //   // this.peer.on('call', (call) => {
  //   //   alert('incoming call');
  //   //   const idLocalVideo = <HTMLVideoElement>(
  //   //     document.getElementById('localStream')
  //   //   );
  //   //   const idRemoteVideo = <HTMLVideoElement>(
  //   //     document.getElementById('remotestream')
  //   //   );
  //   //   this.call.openStream().then((stream) => {
  //   //     call.answer(stream);
  //   //     this.call.playStream(idLocalVideo, stream);
  //   //     call.on('stream', (remoteStream) =>
  //   //       this.call.playStream(idRemoteVideo, remoteStream)
  //   //     );
  //   //   });
  //   // });
  // }
  // public startCall() {
  //   const id = <any>document.getElementById('remoteId');
  //   const idLocalVideo = <HTMLVideoElement>(
  //     document.getElementById('localStream')
  //   );
  //   const idRemoteVideo = <HTMLVideoElement>(
  //     document.getElementById('remotestream')
  //   );
  //   this.callService.openStream().then((stream) => {
  //     this.callService.playStream(idLocalVideo, stream);
  //     const call = this.peer.call(id, stream);
  //     call.on('stream', (remoteStream) =>
  //       this.callService.playStream(idRemoteVideo, remoteStream)
  //     );
  //   });
  // }

  // // public answerCall() {
  // //   this.peer.on('call', (call) => {
  // //     const idLocalVideo = <HTMLVideoElement>(
  // //       document.getElementById('localStream')
  // //     );
  // //     const idRemoteVideo = <HTMLVideoElement>(
  // //       document.getElementById('remotestream')
  // //     );
  // //     this.call.openStream().then((stream) => {
  // //       call.answer(stream);
  // //       this.call.playStream(idLocalVideo, stream);
  // //       call.on('stream', (remoteStream) =>
  // //         this.call.playStream(idRemoteVideo, remoteStream)
  // //       );
  // //     });
  // //   });
  // // }

  public onclickUser(uid: any) {
    this.data.getUser(uid);
    this.chatUser = this.data.user;
    console.log(this.chatUser);
  }

  openWindow() {
    this.diaLog.open(VideoCallComponent, {
      data: {
        remoteId: <any>document.getElementById('remoteId'),
      },
    });
  }

  @ViewChild('endOfChat')
  endOfChat!: ElementRef;

  user$ = this.usersService.currentUserProfile$;
  myChats$ = this.chatsService.myChats$;
  isSending: boolean = false;

  searchControl = new FormControl('');
  messageControl = new FormControl('');
  chatListControl = new FormControl('');
  emoji: String = '';
  //public textArea: string = '';
  public isEmojiPickerVisible!: boolean;

  messages$: Observable<Message[]> | undefined;

  otherUsers$ = combineLatest([this.usersService.allUsers$, this.user$]).pipe(
    map(([users, user]) => users.filter((u) => u.uid !== user?.uid))
  );

  users$ = combineLatest([
    this.otherUsers$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, searchString]) => {
      return users.filter((u) =>
        u.displayName?.toLowerCase().includes(searchString.toLowerCase())
      );
    })
  );

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$,
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value[0])));

  constructor(
    private authService: AuthenticationService,
    private usersService: UsersService,
    private chatsService: ChatsService,
    private router: Router,
    public callService: CallService,
    private diaLog: MatDialog,
    public data: DataService,
    public uploadSer: ImageUploadService
  ) {
    this.messages$ = this.chatListControl.valueChanges.pipe(
      map((value) => value[0]),
      switchMap((chatId) => this.chatsService.getChatMessages$(chatId)),
      tap((data) => {
        this.scrollToBottom();
        console.log(data);
      })
    );
  }

  ngOnInit(): void {
    this.data.getAllUser().subscribe((data) => {
      this.users = data;
    });

    this.currentUser$.subscribe((data: any) => {
      this.user = data;
    });
    // this.users$.subscribe((data)=>{
    //   console.log(data);
    // })
  }

  public addEmoji(event: any) {
    this.emoji = `${this.emoji}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  createChat(user: ProfileUser) {
    this.chatsService
      .isExistingChat(user.uid)
      .pipe(
        switchMap((chatId) => {
          if (!chatId) {
            return this.chatsService.createChat(user);
          } else {
            return of(chatId);
          }
        })
      )
      .subscribe((chatId) => {
        this.chatListControl.setValue([chatId]);
      });
  }

  openNotificationDialog(user: any) {
    const dialogRef = this.diaLog.open(NotificationDialogComponent, {
      width: '90%',
      data: user,
    });
    dialogRef.afterClosed().subscribe((res) => {
      let result = this.usersService.friendRequest(
        res.accept,
        res.currentUser,
        res.user,
        res.userIndex
      );
      if (result) {
        this.usersService.getUser(res.user.from).subscribe((data: any) => {
          this.createChat(data);
          this.usersService.acceptFriendRequest(user, data);
        });
      }
    });
  }

  searchUser() {
    let result = this.searchControl.value;
    const dialogRef = this.diaLog.open(SearchDialogComponent, {
      // width: '50%',
      data: { result },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchControl.setValue('');
    });
    // console.log(result);
  }

  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.chatListControl.value[0];
    if (message && selectedChatId) {
      this.chatsService
        .addChatMessage(selectedChatId, message)
        .subscribe(() => {
          this.scrollToBottom();
        });
      this.messageControl.setValue('');
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  }

  async uploadFile(event: any) {
    this.isSending = true;
    let name = event.target.files[0].name;
    let type = event.target.files[0].type;
    let regex = new RegExp(/image/g);
    type = regex.test(type);

    let uid = this.user.uid;
    let file = event.target.files[0];
    let date = new Date();
    let selectedChatId = this.chatListControl.value[0];
    let filePath = `images/chat/${selectedChatId}/${date}`;
    if (!type) {
      filePath = `files/chat/${selectedChatId}/${date}/${name}`;
    }
    let link$: Observable<any> = this.uploadSer.uploadImage(file, filePath);
    link$
      .pipe(
        switchMap((link: any) => {
          return this.chatsService.addFileMessage(
            selectedChatId,
            link,
            name,
            type
          );
        })
      )
      .subscribe((res: any) => {
        this.isSending = false;
      });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
