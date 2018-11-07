import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({providedIn : 'root'})

export class PostService {

    private posts : Post[] = [];
    private postUpdated = new Subject<Post[]>();

    constructor(private http : HttpClient,private router : Router) {
    
    }

    getPosts() {
        //return this.posts;
        // return [...this.posts];

        this.http.get<{message : String, posts : any}>('http://localhost:3000/api/posts')
                 .pipe(map((postData) => {
                    return postData.posts.map(post => {
                        return {
                            title : post.title,
                            content : post.content,
                            id : post._id,
                            imagePath : post.imagePath
                        }
                    })                        
                 }))
                 .subscribe(transformedPosts => {
                        this.posts = transformedPosts ;
                        this.postUpdated.next([...this.posts]);
                 });
    }

    getPost(id : string) {

        var post = { _id : id} ;
        console.log(post);
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
                            imagePath : response.data.imagePath
                        };
            post.id = response.data._id; 
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
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
                    imagePath : image
            };
        }

        this.http.put("http://localhost:3000/api/posts/" + id, postData).subscribe((response) => {
            this.router.navigateByUrl("/");
        });
    }

    deletePost(postId : string, index : any) {
       
        this.http.delete("http://localhost:3000/api/posts/" + postId)
                 .subscribe((response) => {
                    this.posts.splice(index,1);
                    this.postUpdated.next([...this.posts]);
                    return new Promise((resolve,reject) => {
                        resolve(response);
                        //reject("deletion failed");
                    });
                 });
    }

}