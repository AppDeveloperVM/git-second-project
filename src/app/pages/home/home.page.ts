import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { EMPTY, Observable, Subscription } from 'rxjs';

import { Profile } from '../../submodules/github-provider/models/profile.model';
import { Repo } from '../../submodules/github-provider/models/repo.model';
import { User } from '../../submodules/github-provider/models/user.model';
import { GithubAPIService } from '../../submodules/github-provider/services/github-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  user: User = null;
  repos: Repo =  null;
  profile : Profile = null;
  error: boolean = false;
  errorMessage = null;
  form : FormGroup;
  name : FormControl;
  isLoading = false;

  username : string;
  authkey  = environment.gitKey;

  mostFamous : Array<any>;
  listed : Observable<any>;
  items : Array<any>;
  listType = "";

  constructor(private githubService : GithubAPIService) {
    this.form = new FormGroup({
      name: new FormControl('')
    });

    this.init();
    this.getMostKnown();

    this.profile = new Profile();
    this.profile.user = new User();
    this.profile.repos = new Array();
  }

  ngOnInit() {
  }

  init(){
    this.profile = new Profile();
    this.profile.user = new User();
    this.profile.repos = new Array();
    this.errorMessage = null;
  }

  onKeyDownEvent(event: any){
    try {
      if(event == null) return;
    
    }catch(err){
      console.log(err);
      
    }
  }

  getMostKnown(category : string = 'repoStars'){

    const listPromise = new Promise((resolve,reject) => {

      switch(category){
        case 'repoStars':
          this.listed = this.githubService.getMostStargazedRepos();
          this.listType = 'repo';
          break;
        case 'repoCount':
          this.listed = this.githubService.getUsersWithGreatestRepoCount();
          this.listType = 'user';
          break;
        case 'followedUsers':
          this.listed = this.githubService.getMostFollowedUsers();
          this.listType = 'user';
          break;
      }

      console.log(this.listed);

      this.listed
      .pipe(
        catchError( err => {
          console.log(err);
          reject(err.status);
          return EMPTY;
        })
      ).subscribe(val =>{
          console.log(val);

          this.items = val.items;
          resolve(val);
      })

    });

    listPromise
    .then( (res)=>{
      console.log(res);
      
    })
    .catch((err)=>{
      console.log(err);
      this.handleError(err);
    })

  }

  

  handleError(err){

    switch(err){
      case 404 :
        this.errorMessage = "Usuario no encontrado";
        break;
      case 403 : 
        this.errorMessage = "límite de peticiones";
        break;
      default :
        this.errorMessage = "error desconocido";
        break;
    }

    console.log(this.errorMessage);
    

  }

}
