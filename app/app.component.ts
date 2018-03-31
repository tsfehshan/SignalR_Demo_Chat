import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  private hubConnection: HubConnection;
  nick = '';
  message = '';
  messages: string[] = [];

  public sendMessage(): void {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    const req = this.http.post('http://localhost:61015/api/Conversation',JSON.stringify({
      UserName: this.nick,
      Message: this.message
    }),{headers : headers})
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );

      this.hubConnection
      .invoke('Send', this.nick + ": " + this.message)
.catch(err => console.error(err));

}

constructor(private http: HttpClient){

}

ngOnInit(){
  //this.nick = window.prompt('Your name:', 'John');

    this.hubConnection = new HubConnection('http://localhost:61015/chathub');

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

      this.hubConnection.on('Send', (receivedMessage: string) => {
        const text = `${receivedMessage}`;
        this.messages.push(text);
      });

      this.http.get('http://localhost:61015/api/Conversation').subscribe(datas=> {
        
        var conversations = Object.keys(datas).map(function(data){
          let conversation = datas[data];
          return conversation.userName + ': ' + conversation.message;
      });
        for (let message of conversations) {
          this.messages.push(message);
      }
    },
    err => {
      console.log("Error occured.")
    });

}

}
