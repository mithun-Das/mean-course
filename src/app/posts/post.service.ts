import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({providedIn : 'root'})

export class PostService {

    private httpGetSinglePostUrl = environment.domainUrl + '/post';
    private httpGetAllPostUrl = environment.domainUrl  + '/posts';
    private httpCreatePostUrl = environment.domainUrl + '/post/create';
    private httpUpdatePostUrl = environment.domainUrl + '/post/update/';
    private httpDeletePostUrl = environment.domainUrl + '/post/delete/';
    
    
    private posts : Post[] = [];
    private postUpdated = new Subject<{posts : Post[], postCount : number}>();

    constructor(private http : HttpClient,private router : Router) {
    
    }

    getPosts(pageSize : number,currentPage : number) {
        //return this.posts;
        // return [...this.posts];

        var queryParams = "?pageSize=" + pageSize + "&currentPage=" + currentPage ;

        this.http.get<{message : String, posts : any,maxPosts : number}>(this.httpGetAllPostUrl +  queryParams)
                 .pipe(map((postData) => {
                    return { posts :  postData.posts.map(post => {
                        return {
                            title : post.title,
                            content : post.content,
                            id : post._id,
                            imagePath : post.imagePath,
                            creator : post.creator
                        }
                    }), maxPosts : postData.maxPosts}                    
                 }))
                 .subscribe(transformedPosts => {
                        this.posts = transformedPosts.posts ;
                        this.postUpdated.next({posts : [...this.posts],postCount : transformedPosts.maxPosts});
                 });
    }

    getPost(id : string) {

        var post = {id : id} ;
        return this.http.post(this.httpGetSinglePostUrl, post);
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPost(title : string, content : string, image : File) {
       // var post = {id: "", title :  title, content : content};
        var postData = new FormData();
        
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);

        this.http.post<{message : String, data : any}>(this.httpCreatePostUrl, postData).subscribe((response) => {
            var post = {
                            id: response.data._id, 
                            title :  title,
                            content : content,
                            imagePath : response.data.imagePath,
                            creator : response.data.creator
                        };
            post.id = response.data._id; 
            this.posts.push(post);
            this.postUpdated.next({posts : [...this.posts], postCount : this.posts.length});
            this.router.navigateByUrl("/");
        })
    }

    updatePost(id : string, title : string, content : string, image : File | string) {

        let postData : Post | FormData;

        if(typeof(image) === "object"){
           postData = new FormData();
        
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);    
        }else {
            postData = {
                    id : id, 
                    title : title, 
                    content : content,
                    imagePath : image,
                    creator : ''
            };
        }

        this.http.put(this.httpUpdatePostUrl + id, postData).subscribe((response) => {
            this.router.navigateByUrl("/");
        });
    }

    deletePost(postId : string, index : any) {
       
        this.http.delete<{message : string, status : string}>(this.httpDeletePostUrl + postId)
                 .subscribe((response) => {

                    if(response.status == "success") {
                        this.posts.splice(index,1);
                        this.postUpdated.next({posts : [...this.posts], postCount : this.posts.length});    
                    }
                 });
    }
}