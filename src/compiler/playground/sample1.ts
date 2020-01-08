import { Directive, HostBinding, Input, HostListener } from '@angular/core';
import { RouterLinkWithHref, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'a[routerLinkLang]',
})
export class RouterLinkLangDirective {
  @HostBinding('href') public href: string;
  constructor(private router: Router, private loc: Location, private route: ActivatedRoute) {}
}
