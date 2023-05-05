import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortList',
})
export class SortListPipe implements PipeTransform {
  transform(arr: any[], prop: string): any[] {
    arr.sort((a: any, b: any) => {
      if (a[prop] < b[prop]) {
        return -1;
      } else if (a[prop] > b[prop]) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }
}
