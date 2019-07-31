export const config = {
  routes: [
    { path: '/', exact: true, render: () => import('./routes/MainRoute') },
    { path: '/second', render: () => import('./routes/SecondRoute') },
  ],
};
