import { Component,ViewEncapsulation, OnInit } from '@angular/core';
import { Post }  from './posts/post.model';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor (private authService : AuthService) {}

  ngOnInit() {
    this.authService.autoAuthUser();
  }

}
