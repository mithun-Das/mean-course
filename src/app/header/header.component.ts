import { Component, OnInit, OnDestroy } from  '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
    selector : "app-header",
    templateUrl : "./header.component.html",
    styleUrls : ['./header.component.css']
})


export class HeaderComponent implements OnInit, OnDestroy{

    userIsAuthenticated = false;

    constructor(private authService : AuthService) { }

    ngOnInit() {

        this.userIsAuthenticated = this.authService.getIsAuth();

        this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    ngOnDestroy() {


    }

    onLogOut() {
        this.authService.logout();
    }


}