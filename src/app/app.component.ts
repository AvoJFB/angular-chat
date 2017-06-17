import { Component, OnInit } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  msg = '';
  messages: Array<any>;
  newUser = '';
  user;
  isLoggedIn = false;
  users: Array<any>;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.messages = new Array();
    this.users = new Array();

    this.socketService.on('message-received', (msg: any) => {
      this.messages.push(msg);
    });

    this.socketService.on('update-users', (users: any) => {
      this.users = users;
    });
  }

  handleSubmitNewUser() {
    this.socketService.emit('new-user', {
      username: this.newUser,
    });
    this.user = {
      username: this.newUser,
    };
    this.newUser = '';
    this.isLoggedIn = true;
  }

  handleSubmitNewMessage() {
    this.socketService.emit('send-message', {
      msg: this.msg,
      author: this.user,
      date: Date.now(),
    });
    this.msg = '';
  }

  handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmitNewMessage();
    }
  }

}
