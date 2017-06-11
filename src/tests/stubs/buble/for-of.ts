export default [
  {
    description: 'ignores for-of with `transforms.forOf === false`',
    options: { transforms: { forOf: false } },
    input: `for ( x of y ) {}`,
    output: `for ( x of y ) {}`,
  },

  {
    description: 'transpiles for-of with array assumption with `transforms.dangerousForOf`',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let member of array ) {
				doSomething( member );
			}`,

    output: `
			for ( var i = 0, list = array; i < list.length; i += 1 ) {
				var member = list[i];

				doSomething( member );
			}`,
  },

  {
    description: 'transpiles for-of with expression',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let member of [ 'a', 'b', 'c' ] ) {
				doSomething( member );
			}`,

    output: `
			for ( var i = 0, list = [ 'a', 'b', 'c' ]; i < list.length; i += 1 ) {
				var member = list[i];

				doSomething( member );
			}`,
  },

  {
    description: 'transpiles for-of that needs to be rewritten as function',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let member of [ 'a', 'b', 'c' ] ) {
				setTimeout( function () {
					doSomething( member );
				});
			}`,

    output: `
			var loop = function () {
				var member = list[i];

				setTimeout( function () {
					doSomething( member );
				});
			};

			for ( var i = 0, list = [ 'a', 'b', 'c' ]; i < list.length; i += 1 ) loop();`,
  },

  {
    description: 'transpiles body-less for-of',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let member of array ) console.log( member );`,

    output: `
			for ( var i = 0, list = array; i < list.length; i += 1 ) {
				var member = list[i];

				console.log( member );
			}`,
  },

  {
    description: 'transpiles space-less for-of',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for (const key of this.keys) {
				console.log(key);
			}`,

    output: `
			var this$1 = this;

			for (var i = 0, list = this$1.keys; i < list.length; i += 1) {
				var key = list[i];

				console.log(key);
			}`,
  },

  {
    description: 'handles continue in for-of',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let item of items ) {
				if ( item.foo ) continue;
			}`,

    output: `
			for ( var i = 0, list = items; i < list.length; i += 1 ) {
				var item = list[i];

				if ( item.foo ) { continue; }
			}`,
  },

  {
    description: 'handles this and arguments in for-of',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let item of items ) {
				console.log( this, arguments, item );
				setTimeout( () => {
					console.log( item );
				});
			}`,

    output: `
			var arguments$1 = arguments;
			var this$1 = this;

			var loop = function () {
				var item = list[i];

				console.log( this$1, arguments$1, item );
				setTimeout( function () {
					console.log( item );
				});
			};

			for ( var i = 0, list = items; i < list.length; i += 1 ) loop();`,
  },

  {
    description: 'for-of with empty block (#80)',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( let x of y ) {}`,

    output: `
			`,
  },

  {
    description: 'for-of with empty block and var (#80)',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for ( var x of y ) {}`,

    output: `
			var x;`,
  },

  {
    description: 'return from for-of loop rewritten as function',
    options: { transforms: { dangerousForOf: true } },

    input: `
			function foo () {
				for ( let x of y ) {
					setTimeout( function () {
						console.log( x );
					});

					if ( x > 10 ) return;
				}
			}`,

    output: `
			function foo () {
				var loop = function () {
					var x = list[i];

					setTimeout( function () {
						console.log( x );
					});

					if ( x > 10 ) { return {}; }
				};

				for ( var i = 0, list = y; i < list.length; i += 1 ) {
					var returned = loop();

					if ( returned ) return returned.v;
				}
			}`,
  },

  {
    description: 'allows destructured variable declaration (#95)',
    options: { transforms: { dangerousForOf: true } },

    input: `
			for (var {x, y} of [{x: 1, y: 2}]) {
				console.log(x, y);
			}`,

    output: `
			for (var i = 0, list = [{x: 1, y: 2}]; i < list.length; i += 1) {
				var ref = list[i];
				var x = ref.x;
				var y = ref.y;

				console.log(x, y);
			}`,
  },
]
