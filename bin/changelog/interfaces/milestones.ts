export namespace IMilestones {

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
