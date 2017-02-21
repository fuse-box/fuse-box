export namespace IIssue {

    export interface User {
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

    export interface Label {
        id: number;
        url: string;
        name: string;
        color: string;
        default: boolean;
    }

    export interface Assignee {
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

    export interface Milestone {
        url: string;
        html_url: string;
        labels_url: string;
        id: number;
        number: number;
        state: string;
        title: string;
        description: string;
        creator: Creator;
        open_issues: number;
        closed_issues: number;
        created_at: Date;
        updated_at: Date;
        closed_at: Date;
        due_on: Date;
    }

    export interface PullRequest {
        url: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
    }

    export interface Assignee2 {
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
        id: number;
        url: string;
        repository_url: string;
        labels_url: string;
        comments_url: string;
        events_url: string;
        html_url: string;
        number: number;
        state: string;
        title: string;
        body: string;
        user: User;
        labels: Label[];
        assignee: Assignee;
        milestone: Milestone;
        locked: boolean;
        comments: number;
        pull_request: PullRequest;
        closed_at?: any;
        created_at: Date;
        updated_at: Date;
        assignees: Assignee2[];
    }

}
