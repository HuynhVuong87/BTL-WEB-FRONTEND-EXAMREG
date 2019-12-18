import { Injectable, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as Fuse from 'fuse.js';
import { Notyf } from 'notyf';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


const options: Fuse.FuseOptions<any> = {
  tokenize: true,
  threshold: 0,
  location: 0,
  distance: 0,
};

@Injectable()
// tslint:disable-next-line: class-name
export class helperService {

  private sellsCollection: AngularFirestoreCollection<any>;

  public RoleName = [
    {
      id: 0,
      name: 'Người Mới'
    }, {
      id: 1,
      name: 'Sinh Viên'
    }, {
      id: 2,
      name: 'Quản Trị Viên'
    }
  ];
  public gender = [
    {
      id: 0,
      name: 'KHÔNG XÁC ĐỊNH'
    }, {
      id: 1,
      name: 'NAM'
    }, {
      id: 2,
      name: 'NỮ'
    }
  ];

  public rootUrl = 'http://localhost:4000/api/v1/';

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore
    // @Inject(NOTYF) private notyf: Notyf
  ) {

  }

  subRoom() {
    this.sellsCollection = this.afs.collection('Rooms');
    return this.sellsCollection.valueChanges();
  }

  sortArrayByKey(array, key: string, type: string) {
    if (type === 'asc') {
      return array.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0));
    }
  }
  create_milisec(date) {
    const d = (date === '' ? new Date() : new Date(date)).getTime().toString();
    return Number(d.substring(0, d.length - 3));
  }

  fullTextSearch(dataToSearch, value, keys) {
    options.keys = keys;
    const fuse = new Fuse(dataToSearch, options);
    return fuse.search(value);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }

  noty(type: string, duration: number, message: string) {
    const notyf = new Notyf({
      ripple: true,
      duration,
      types: [
        {
          type: 'success',
          backgroundColor: 'rgba(0, 213, 59, 0.69)'
        }
      ]
    });
    notyf.open({
      type,
      message
    });
  }

  validateBirthday(input: string) {
    const reg1 = /([0-3]?\d\/{1})([01]?\d\/{1})([12]{1}\d{3})/;
    const reg2 = /([0-3]?\d\/{1})([01]?\d\/{1})([12]{1}\d{1})/;
    if (reg1.test(input)) {
      return true;
    } else if (reg2.test(input)) {
      return true;
    } else { return false; }
  }
}
