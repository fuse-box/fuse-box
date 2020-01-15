export var Foo = (function() {
  function Bar() {
    function one() {
      function two() {
        console.log(Foo);
      }
    }
  }
  function Foo() {}
})();
