
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn : "root" })

export class AuthService {

    private token : string;
    private isUserAuthenticated = false;
    private tokenTimer : any;
    private userId : string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http : HttpClient, private router : Router) {

    }

    getAuthStatusListener () {
        return this.authStatusListener.asObservable();
    }

    getToken() {
        return this.token;
    }

    getUserId() {
        return this.userId;
    }

    getIsAuth() {
        return this.isUserAuthenticated;
    }

    autoAuthUser() {
        var authInfo = this.getAuthData();

        if(!authInfo) {
            this.router.navigateByUrl("/login"); 
        }

        var now = new Date();
        var expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0 ) {
            this.token = authInfo.token;
            this.userId = authInfo.userId;
            this.isUserAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresIn / 1000);
        }
    }

    createUser(email : String, password : String) {

        const authData : AuthData = {
            email : email,
            password : password
        }

        this.http.post("http://localhost:3000/signup",authData).subscribe((response) => {
            this.router.navigateByUrl("/"); 
        });
    }

    login(email : String, password : String) {
        const authData : AuthData = {
            email : email,
            password : password
        }

        this.http.post<{token : string, expiresIn : number, userId : string}>("http://localhost:3000/login",authData).subscribe((response) => {
            const expiresInDuration = response.expiresIn;
            this.token = response.token;
            this.userId = response.userId;
            this.isUserAuthenticated = true;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresInDuration);
            var now = new Date();
            var expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
            this.saveAuthData(this.token, expirationDate,this.userId);
            this.router.navigateByUrl("/");
        });
    }

    logout() {
        this.token = null;
        this.userId = null;
        this.isUserAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigateByUrl("/login");
    }

    private setAuthTimer(duration : number) {
        this.tokenTimer = setTimeout(() => {
            this.logout(); 
         }, duration * 1000);
    }

    private saveAuthData (token : string, expirationDate : Date, userId : string) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expiration', expirationDate.toISOString());

    }

    private clearAuthData () {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const expirationDate = localStorage.getItem("expiration");

        if(token && expirationDate) {
            return {
                token : token,
                userId : userId,
                expirationDate : new Date(expirationDate)
            }
        }

        return ;
    }
}