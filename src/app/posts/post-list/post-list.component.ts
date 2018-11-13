import { Component,Input,OnInit,OnDestroy } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from './../post.service';
import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
//import { AppRoutingModule } from './../../app-routing.module';

@Component({
    selector : "app-post-list",
    templateUrl : "./post-list.component.html",
    styleUrls : ["./post-list.component.css"],
})

export class PostListComponent implements OnInit, OnDestroy{


   // @Input() posts : Post[] = [];
     totalPosts = 10;
     postsPerPage = 2;
     currentPage = 1;
     pageSizeOptions = [1,2,5,10];
     isLoading = true;
     posts : Post[] = [];
     private userId : string;
     private postSub : Subscription;


    //postService : PostService;

    constructor(public postService : PostService, public authService : AuthService) {
        //this.postService = postService;
    }

    ngOnInit() {
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postSub = this.postService.getPostUpdateListener()
        .subscribe((data) => {
            this.posts = data.posts;
            this.totalPosts = data.postCount;
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }

    onDelete(postId : string , index : any) {
        this.postService.deletePost(postId,index);
    }

    onChangedPage(pageData : PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.ngOnInit();

    }
}