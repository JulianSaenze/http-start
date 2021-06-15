import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from "rxjs";


@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

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
      postData,
      {
        observe: 'response'
      }
    )
    //if a component doesn't care about the response - subscribe in service is okay
    .subscribe(responseData => {
      console.log(responseData);
    }, error => {
      this.error.next(error.message);
    });
  }

  //transform data with pipe
  //map operator - allow to get some data and return new data which is rewrapped into an observable
  //tell which type of object the retrieved data is -> <{[key: string]: Post}>
  fetchPosts(){
    let searchParams = new HttpParams();
    //attach multiple params
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    //setting up in service and subscribing in the component
    return this.http
      .get<{[key: string]: Post}>(this.url,
        {
          //passing key-value-pairs of the header
          headers: new HttpHeaders({ 'Custom-Header': 'Hello'}),
          //changing format firebase returns its data
          params: searchParams
        })
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)){
            //push a new object in the array / spread operator will pull out all key value pairs of the nested object
            postsArray.push({...responseData[key], id: key})
          }
        }
        return postsArray;
      }),
      catchError(errorResponse => {
        //generic error handling tasks - sending to analytics server maybe
        return throwError(errorResponse);
      })
    );
  }

  clearPosts() {
    return this.http.delete(this.url);
  }
}
