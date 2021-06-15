import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  url: string = 'https://ng-http-start-aa1e8-default-rtdb.europe-west1.firebasedatabase.app/posts.json';
  isFetching = false;

  constructor(private http: HttpClient) {}
  ngOnInit() {
    //whenever this app/page loads -> get the data
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    //store data args (url/request body(data to store - normally json data))
    //Requests are only set if subscribed
    this.http
    .post<{name: string}>(
      this.url,
      postData
    ).subscribe(responseData => {
      console.log(responseData);
    });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  //transform data with pipe
  //map operator - allow to get some data and return new data which is rewrapped into an observable
  //tell which type of object the retrieved data is -> <{[key: string]: Post}>
  private fetchPosts() {
    this.isFetching = true;
    this.http
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
      }))
      .subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      });
  }
}
