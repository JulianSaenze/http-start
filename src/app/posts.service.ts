import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class PostsService {

  constructor(private http: HttpClient){}

  url: string = 'https://ng-http-start-aa1e8-default-rtdb.europe-west1.firebasedatabase.app/posts.json';

  createAndStorePost(title: string, content: string){
    //send http request
    //store data args (url/request body(data to store - normally json data))
    //Requests are only set if subscribed
    const postData: Post = {title: title, content: content};
    this.http
    .post<{name: string}>(
      this.url,
      postData
    )
    //if a component doesn't care about the response - subscribe in service is okay
    .subscribe(responseData => {
      console.log(responseData);
    });
  }

  //transform data with pipe
  //map operator - allow to get some data and return new data which is rewrapped into an observable
  //tell which type of object the retrieved data is -> <{[key: string]: Post}>
  fetchPosts(){
    //setting up in service and subscribing in the component
    return this.http
      .get<{[key: string]: Post}>(this.url)
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)){
            //push a new object in the array / spread operator will pull out all key value pairs of the nested object
            postsArray.push({...responseData[key], id: key})
          }
        }
        return postsArray;
      })
    );
  }

  clearPosts() {
    return this.http.delete(this.url);
  }
}
