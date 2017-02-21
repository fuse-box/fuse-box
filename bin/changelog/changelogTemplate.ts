import {table} from '../utils/Markdown';
import {link} from '../utils/Markdown';
import {noCase} from '../utils/Markdown';
import {altH1} from '../utils/Markdown';
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
    getIssueTable(issues: IIssue.RootObject[]) {
        const rows = issues.map((issue) => {
            return {
                Title: link(issue.title, issue.html_url),
                Closed: issue.closed_at ? issue.closed_at : '--',
            }
        });
        return table(rows);
    }
    createMd() {
        const template = this._milestones.map((item) => {
            return `
                ${altH1(item.milestone.title)}\n\r
                ${this.getIssueTable(item.issues)}
            `;
        });
        return template;
    }
}