import { Injectable } from '@nestjs/common';

@Injectable()
class DialogService {
  show() {
    // do whatever
  }
}

@Injectable()
class MyService {
  constructor(private readonly dialog: DialogService, private readonly ds: DialogService) {}

  showDialog() {
    this.dialog.show(); // THIS DOES NOT WORK; this.dialog is undefined
    this.ds.show(); // works fine!
  }
}
