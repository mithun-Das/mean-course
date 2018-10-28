import { Component,Input,OnInit,OnDestroy } from '@angular/core';
import { Post } from './../post.model';
import { PostService } from './../post.service';
import { Subscription } from 'rxjs';


@Component({
    selector : "app-post-list",
    templateUrl : "./post-list.component.html",
    styleUrls : ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy{


   // @Input() posts : Post[] = [];
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
        });
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }
}