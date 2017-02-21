import {h5} from '../utils/Markdown';
import {noCase, link, table, altH1, humanDate} from '../utils/Markdown';
import * as semver from 'semver';
import {IMilestones, IIssue} from './interfaces';
import {Observable} from '@reactivex/rxjs/dist/cjs/Observable';
import {ChangelogApi} from './changelog';

export interface IMileStoneWithIssues {
    milestone: IMilestones.RootObject; 
    issues: IIssue.RootObject[];
}

export class ChangeLogTemplate {
    private _tableHeader: string[];
    private showFilter = ['id', 'title', 'comments'];

    constructor(private _milestones: IMileStoneWithIssues[]) {

    }

     sortByMileStone(a:IMileStoneWithIssues,b:IMileStoneWithIssues) {
         const c = a.milestone.title;
         const d = b.milestone.title;
         
        if (semver.gt(c, d)) {
            return -1;
        }
            
        if (semver.lt(c, d)){
            return 1;
        }
        return 0;
    }

    getIssueTable(issues: IIssue.RootObject[]) {
        const rows = issues.map((issue) => {
            let title = `${link('ISSUE ' + issue.number, issue.html_url)} ${issue.title}`

            if (issue.pull_request) {
                title = `${link('PR ' + issue.number, issue.pull_request.html_url)} ${issue.title}`
            }
            return {
                Title: title,
                Closed: issue.closed_at ? humanDate(issue.closed_at) : '--',
            }
        });
        return table(rows);
    }

    createMd() {
        const milestonesMd = this._milestones
            .sort(this.sortByMileStone)
            .map((item) => {
                return `
${altH1(link(item.milestone.title, item.milestone.html_url))}\n\r
${item.milestone.description}\n\r
${this.getIssueTable(item.issues)}
                `;
            });
        let template = '';
        milestonesMd.forEach((milestoneMd) => template+=milestoneMd);
        return template;
    }
}