import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import { Post } from './../post.model';
import { NgForm } from '@angular/forms';

import { PostListComponent } from './../post-list/post-list.component';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
    selector : "./app-post-create",
    templateUrl : "./post-create.component.html",
    styleUrls : ["./post-create.component.css"]
})

export class PostCreateComponent implements OnInit{

    private mode = 'create';
    private postId : string;    
    public post: Post = {id : '', title : '', content : ''};

  constructor(public postService : PostService, public route : ActivatedRoute) {  }  

// @Output()   postCreated = new EventEmitter<Post>();

        ngOnInit() {

            this.route.paramMap.subscribe( (paramMap : ParamMap) => {
                if(paramMap.has('postId')){
                    this.mode = 'edit';
                    this.postId = paramMap.get('postId');
                    this.postService.getPost(this.postId).subscribe((response) => {
                       this.post = {
                           id : response[0]._id,
                           title : response[0].title,
                           content : response[0].content
                       }
                   });
                }else{
                    this.mode = 'create';
                    this.postId = null;
                    
                }
            });
        }

        onSavePost(form : NgForm) {

            if(form.invalid){
                return ;
            }

            const post : Post = {   id : "",
                                    title : form.value.title , 
                                    content : form.value.content
                                } ;

            // this.postCreated.emit(post);

            if(this.mode == "create"){
                this.postService.addPost( form.value.title,form.value.content);
                console.log("Create Mode");
            }else {
                this.postService.updatePost(this.postId,form.value.title,form.value.content);
                console.log(this.postId + ' ' + form.value.title + ' ' + form.value.content)
            }

            

        }
}