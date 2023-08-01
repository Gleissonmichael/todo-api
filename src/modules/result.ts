// @ts-nocheck
export class Result<T> {
    success: boolean;
    data: T;
    count?: number;
  
    constructor(success: boolean);
    constructor(success: boolean, data: T);
    constructor(success: boolean, data: T, count: number);
    constructor(success: boolean, data?: T, count?: number) {
      this.success = success;
      this.data = data;
      this.count = count;
    }
  }
  