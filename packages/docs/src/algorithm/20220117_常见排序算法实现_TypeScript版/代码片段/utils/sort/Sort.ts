import type { TypeCompareFun, TypeCompareParam } from '../comparator/Comparator';
import Comparator from '../comparator/Comparator';

export interface ICallbacks {
  // If provided then all elements comparisons will be done through this callback.
  compareCallback?: TypeCompareFun;
  // If provided it will be called each time the sorting function is visiting the next element.
  // 测试用例中，验证复杂度的时候，用到这个回调
  visitingCallback?: (a?: any) => void;
}

export default class Sort {
  protected callbacks: ICallbacks;
  protected comparator: Comparator;

  constructor(originalCallbacks?: ICallbacks) {
    this.callbacks = Sort.initSortingCallbacks(originalCallbacks as ICallbacks);
    this.comparator = new Comparator(this.callbacks.compareCallback);
  }

  static initSortingCallbacks(originalCallbacks: ICallbacks): ICallbacks {
    const callbacks = originalCallbacks || {};
    const stubCallback = () => {};

    callbacks.compareCallback = callbacks.compareCallback || undefined;
    callbacks.visitingCallback = callbacks.visitingCallback || stubCallback;

    return callbacks;
  }

  public sort(array?: TypeCompareParam[]) {
    console.log('sort, array:', array);
    throw new Error('sort method must be implemented');
  }
}
