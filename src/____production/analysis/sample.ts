console.log(process.env.NODE_ENV);
//var process = { env: { NODE_ENV: 'dev' } };

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'foo') {
  console.log('that is foo');
} else {
  console.log('that is not foo');
}
