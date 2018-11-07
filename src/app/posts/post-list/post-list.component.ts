import { Component,Input,OnInit,OnDestroy } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from './../post.service';
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
     pageSizeOptions = [1,2,5,10];
     isLoading = true;
     posts : Post[] = [];
     private postSub : Subscription;


    //postService : PostService;

    constructor(public postService : PostService) {
        //this.postService = postService;
    }

    ngOnInit() {
        this.postService.getPosts();
        this.postSub = this.postService.getPostUpdateListener()
        .subscribe((post : Post[]) => {
            this.posts = post;
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
        console.log(pageData);
    }
}