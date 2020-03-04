class Bar {
  // this `foo` decorator not called because `methodNoParam` has no parameter
  // try to add a parameter -- then it will get called
  @foo()
  methodNoParam() {
    console.log('methodNoParam called');

    return 'methodNoParam';
  }
}
