import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({providedIn : 'root'})

export class PostService {

    private posts : Post[] = [];
    private postUpdated = new Subject<{posts : Post[], postCount : number}>();

    constructor(private http : HttpClient,private router : Router) {
    
    }

    getPosts(pageSize : number,currentPage : number) {
        //return this.posts;
        // return [...this.posts];

        var queryParams = "?pageSize=" + pageSize + "&currentPage=" + currentPage ;

        this.http.get<{message : String, posts : any,maxPosts : number}>('http://localhost:3000/api/posts' + queryParams)
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
        return this.http.post("http://localhost:3000/post", post);
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

        this.http.post<{message : String, data : any}>('http://localhost:3000/api/posts',postData).subscribe((response) => {
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

        this.http.put("http://localhost:3000/api/posts/" + id, postData).subscribe((response) => {
            this.router.navigateByUrl("/");
        });
    }

    deletePost(postId : string, index : any) {
       
        this.http.delete<{message : string, status : string}>("http://localhost:3000/api/posts/" + postId)
                 .subscribe((response) => {

                    if(response.status == "success") {
                        this.posts.splice(index,1);
                        this.postUpdated.next({posts : [...this.posts], postCount : this.posts.length});    
                    }
                 });
    }
}