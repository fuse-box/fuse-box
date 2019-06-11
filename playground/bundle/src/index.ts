//import 'tslib';
import delay from 'lodash-es/delay';
console.log(delay);

// import './styles/main.scss';
// import { Button } from '@material-ui/core';
// console.log(Button);

// import 'tinymce';
// import 'tinymce/themes/silver/theme';

// import * as angular from 'angular';

// import '@uirouter/angular-hybrid/';
// angular.module('myApp', ['ui.router', 'ui.router.upgrade']);
// angular.bootstrap(document, ['myApp']);

// // //import './circular';

// // // import { Other } from 'other/Other';

// // import './styles/raw.css';
// import * as hammer from 'hammerjs';
// console.log(hammer);

// // import { FooBarComponent } from '@client/FooBarComponent';
// // console.log(FooBarComponent);

// // console.log(process.env);
// // //import 'fooshit';

// import * as moment from 'moment';
// console.log(moment);
// import * as shit from '@angular/platform-browser-dynamic';
// console.log(shit);

// console.log(lodash);
// import { FooClass } from './foo';
// import { bar } from './bar';
// import { not } from './noi';

// document.addEventListener('click', () => {
//   console.log('FooClass', new FooClass());
//   bar();
//   not();
//   alert(1);
// });

// console.log(222);

// import { HubConnectionBuilder } from '@aspnet/signalr';

// export const hub = new HubConnectionBuilder().withUrl('https:/localhost:4444').build();

// import { colors } from '@material-ui/core';
// console.log(colors);
//export const red = colors.red[500];

// import ApolloClient from 'apollo-boost';
// import { ApolloProvider } from 'react-apollo';

// console.log(ApolloClient, ApolloProvider);

// const a = {};
// console.log(a instanceof Buffer);

// import * as auth from 'auth0-js';
// console.log(auth);
// console.log(process.browser);
console.log('-----');
async function getArticles() {
  const result = await fetch('./fuck.json');
  console.log(result.status);
  console.log(await result.text());
}

getArticles();
