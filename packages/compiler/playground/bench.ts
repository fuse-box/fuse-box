function hrMillis(measure) {
  return measure[0] * 1000 + measure[1] / 1e6;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function bench(props: { iterations: number }) {
  const arr = {};
  const result = {};
  const iterations = [];
  for (let i = 0; i <= props.iterations; i++) {
    iterations.push(i);
  }
  return {
    measure: (name: string, fn: (index : number) => any) => {
      arr[name] = fn;
    },
    start: () => {
      for (const name in arr) {
        for (const i of iterations) {
          const hrstart = process.hrtime();
          arr[name](i);
          const end = process.hrtime(hrstart);
          if (!result[name]) {
            result[name] = [];
          }
          result[name].push(hrMillis(end));
        }
      }
      for (const item in result) {
        const totalRuns = result[item].length;
        let totalTime = 0;
        result[item].map(time => {
          totalTime += time;
        });
        const avgTime = totalTime / totalRuns;
        console.log(`${item}: ${avgTime}ms (${totalRuns} runs)`);
      }
    }
  };
}
