import * as GitHubApi from 'github';
import * as request from 'request';

import { GithubConfig } from '../github-config';
import { Observable } from '@reactivex/rxjs';

export namespace IMilestone {

    export interface Creator {
        login: string;
        id: number;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    }

    export interface RootObject {
        url: string;
        html_url: string;
        labels_url: string;
        id: number;
        number: number;
        title: string;
        description: string;
        creator: Creator;
        open_issues: number;
        closed_issues: number;
        state: string;
        created_at: Date;
        updated_at: Date;
        due_on: Date;
        closed_at?: any;
    }
}

export class GithubApi {
  private github: GitHubApi;
  private _uri: string = 'https://api.github.com';
  
  constructor(options = {}, private _owner: string = 'fuse-box', private _repo: string = 'fuse-box') {
    this.github = new GitHubApi(Object.assign({
        // optional 
        debug: true,
        protocol: "https",
        host: "api.github.com", // should be api.github.com for GitHub 
        pathPrefix: "/api/v3", // for some GHEs; none for GitHub 
        timeout: 5000
    }, options));
   }
  private get repo() {
    return `${this._owner}/${this._repo}`;
  }

  authenticate() {
    this.github.authenticate({
      type: "oauth",
      token: GithubConfig.token
    })
  }
  /**
   * @link [milestones](https://developer.github.com/v3/issues/milestones/#list-milestones-for-a-repository)
   * @type {Observable<any>}
   * @memberOf GithubApi
   */
  public get milestones() {
    return Observable.fromPromise(this.github.issues.getMilestones({
      owner: this._owner,
      repo: this._repo,
      state: 'closed'
    }));
    // return Observable.fromEvent(request.get(this.url('releases')).auth('drmabuse@posteo.de', 'deluxe26477!'), 'response')
    //   .map((resp: any) => {
    //     debugger;
    //     return <IMilestone.RootObject[]>resp.request.body
    //   });
  }
}


const api = new GithubApi();
api.milestones.subscribe((milestones) => {
  console.log(milestones);
});

