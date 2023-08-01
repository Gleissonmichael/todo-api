// @ts-nocheck
import { BlobOptions } from 'buffer';
import moment from 'moment';
import { CustomError } from '../../custom.error';
import { isNull } from 'util';

export class Validation {
  public static validate(obj: any, dictionary?: Map<number, string>) {
    return new VTopObject(obj, false, new VContext([], dictionary));
  }
}

class VContext {
  constructor(public validations: CustomError[], public dictionary: Map<number, string>) {}
}

class VObject {
  constructor(private name: string, private obj: () => [any, any, boolean], private optional: boolean, protected context: VContext, private ignore: boolean) {}

  // private _continue(): boolean {
  //   return this.obj() && !(this.optional && !Object.prototype.hasOwnProperty.call(this.obj(), this.name));
  // }

  public not: { valid: () => Throw<VObject>; exists: () => Throw<VObject> } = {
    valid: () => {
      if (this.ignore) return new IgnoreThrow<VObject>(this);

      const fn = () => typeof getValue(this.obj) !== 'object';
      return new Throw<VObject>(fn, this, this.context);
    },

    exists: () => {
      if (this.ignore) return new IgnoreThrow<VObject>(this);

      const fn = () => !doesFieldExists(this.obj, this.name);
      return new Throw<VObject>(fn, this, this.context);
    },
  };

  public field(name: string): VValidation<VObject> {
    return new VValidation(name, setValue(this.obj, name, this.optional), this, this.context, this.ignore);
  }
}

class VTopObject {
  private name: string;
  private obj: () => [any, any, boolean];

  constructor(obj: any, private optional: boolean, protected context: VContext) {
    this.name = 'i';
    const fun = () => [{ [this.name]: obj }, obj, true] as [any, any, boolean];
    this.obj = setValue(fun, this.name, false);
  }

  // private _continue(): boolean {
  //   return !(this.optional && !Object.prototype.hasOwnProperty.call(this.obj(), this.name));
  // }

  public not: {
    valid: () => Throw<VTopObject>;
    exists: () => Throw<VTopObject>;
  } = {
    valid: () => {
      const fn = () => typeof getValue(this.obj) !== 'object';
      return new Throw(fn, this, this.context);
    },

    exists: () => {
      const fn = () => !doesFieldExists(this.obj, this.name);
      return new Throw(fn, this, this.context);
    },
  };

  public field(name: string): VValidation<VTopObject> {
    return new VValidation(name, setValue(this.obj, name, this.optional), this, this.context, false);
  }

  public throws(type: ThrowType) {
    if (type == ThrowType.Single) {
      const item = this.context.validations[0];

      if (item) {
        throw item;
      }
    }
  }
}

class Throw<T> {
  constructor(protected condition: () => boolean, protected owner: T, protected context: VContext) {}

  public throw(status: number, code: number): T;
  public throw(status: number, code: number, message: string): T;
  public throw(status: number, code: number, message?: string): T {
    if (message != null) {
      if (this.condition()) {
        this.context.validations.push(new CustomError(status, code, message));
      }
    } else {
      if (this.condition()) {
        let message = 'error not found in dictionary';

        if (this.context.dictionary) {
          message = this.context.dictionary.get(code) || message;
        }

        this.context.validations.push(new CustomError(status, code, message));
      }
    }
    return this.owner;
  }
}

/**
 * This is a Throw when the field must be ignored.
 * It is an empty object
 */
class IgnoreThrow<T> extends Throw<T> {
  constructor(owner: T) {
    super(() => false, owner, null);
  }
}

class VValidation<T> {
  constructor(private name: string, private obj: () => [any, any, boolean], private owner: T, private context: VContext, private ignore: boolean) {}

  public optional() {
    return new VType<T>(this.name, this.obj, true, this.owner, this.context, this.ignore);
  }

  public required() {
    return new VType<T>(this.name, this.obj, false, this.owner, this.context, this.ignore);
  }
}

class VType<T> {
  constructor(private name: string, private obj: () => [any, any, boolean], private optional: boolean, private owner: T, private context: VContext, private ignore: boolean) {}

  public scalar() {
    return new VCheck<T, VScalar>(this.owner, () => {
      const ignore = this.ignore || shouldIgnore(this.obj, this.optional, this.name);
      return new VScalar(this.name, this.obj, this.optional, this.context, ignore);
    });
  }

  public array() {
    return new VCheck<T, VArray>(this.owner, () => {
      const ignore = this.ignore || shouldIgnore(this.obj, this.optional, this.name);
      return new VArray(this.name, this.obj, this.optional, this.context, ignore);
    });
  }

  public object() {
    return new VCheck<T, VObject>(this.owner, () => {
      const ignore = this.ignore || shouldIgnore(this.obj, this.optional, this.name);
      return new VObject(this.name, this.obj, this.optional, this.context, ignore);
    });
  }
}

class VCheck<T, K> {
  constructor(private owner: T, private build: () => K) {}

  public check(fn: (c: K) => void) {
    fn(this.build());
    return this.owner;
  }
}

class VScalar {
  constructor(private name: string, private obj: () => [any, any, boolean], private optional: boolean, private context: VContext, private ignore: boolean) {}

  public not: {
    valid: () => Throw<VScalar>;
    supplied: () => Throw<VScalar>;
    exists: () => Throw<VScalar>;
    string: () => Throw<VScalar>;
    array: () => Throw<VScalar>;
    in: (items: string[]) => Throw<VScalar>;
    length: (from: number, to: number) => Throw<VScalar>;
    range: (from: number, to: number) => Throw<VScalar>;
    number: () => Throw<VScalar>;
    integer: () => Throw<VScalar>;
    date: (format?: string) => Throw<VScalar>;
    time: (format?: string) => Throw<VScalar>;
    boolean: () => Throw<VScalar>;
  } = {
    valid: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && (Array.isArray(getValue(this.obj)) || typeof getValue(this.obj) == 'object');
      return new Throw<VScalar>(fn, this, this.context);
    },

    supplied: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => !doesFieldExists(this.obj, this.name);
      return new Throw<VScalar>(fn, this, this.context);
    },

    exists: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => !doesFieldExists(this.obj, this.name);
      return new Throw<VScalar>(fn, this, this.context);
    },

    string: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && typeof getValue(this.obj) !== 'string';
      return new Throw<VScalar>(fn, this, this.context);
    },

    array: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => typeof getValue(this.obj) !== 'string' || !/^\d+(,\d+)*$/.test(getValue(this.obj));
      return new Throw<VScalar>(fn, this, this.context);
    },

    in: (items: string[]) => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => {
        if (getValue(this.obj)) {
          const contains = items.includes(getValue(this.obj) as any as string);
          return !contains;
        }
        return false;
      };
      return new Throw<VScalar>(fn, this, this.context);
    },

    length: (from: number, to: number) => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => {
        if (getValue(this.obj) !== null && typeof getValue(this.obj) == 'string') {
          const str = getValue(this.obj) as any as string;
          if (!str) return true;
          return str.length < from || str.length > to;
        }
        return false;
      };
      return new Throw<VScalar>(fn, this, this.context);
    },

    range: (from: number, to: number) => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => {
        if (getValue(this.obj) !== null && typeof getValue(this.obj) == 'number') {
          const num = getValue(this.obj) as any as number;
          if (!num) return true;
          return num < from || num > to;
        }
        return false;
      };
      return new Throw<VScalar>(fn, this, this.context);
    },

    number: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && isNaN(getValue(this.obj) as any as number);
      return new Throw<VScalar>(fn, this, this.context);
    },

    integer: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && isNaN(parseInt(getValue(this.obj) as any));
      return new Throw<VScalar>(fn, this, this.context);
    },

    date: (format = 'YYYY-MM-DD') => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && !moment(getValue(this.obj), format, true).isValid();
      return new Throw<VScalar>(fn, this, this.context);
    },

    time: (format = 'HH:mm') => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && !moment(getValue(this.obj), format, true).isValid();
      return new Throw<VScalar>(fn, this, this.context);
    },

    boolean: () => {
      if (this.ignore) return new IgnoreThrow<VScalar>(this);

      const fn = () => getValue(this.obj) !== null && getValue(this.obj) !== true && getValue(this.obj) !== 'true' && getValue(this.obj) !== false && getValue(this.obj) !== 'false';
      return new Throw<VScalar>(fn, this, this.context);
    },
  };
}

class VArray {
  constructor(private name: string, private obj: () => [any, any, boolean], private optional: boolean, private context: VContext, private ignore: boolean) {}

  // private _continue(): boolean {
  //   return !(this.optional && isNotNull(this.obj()) && !Object.prototype.hasOwnProperty.call(this.obj(), this.name));
  // }

  public not: {
    valid: () => Throw<VArray>;
    supplied: () => Throw<VArray>;
    exists: () => Throw<VArray>;
  } = {
    supplied: () => {
      if (this.ignore) return new IgnoreThrow<VArray>(this);

      const fn = () => !getValue(this.obj);
      return new Throw<VArray>(fn, this, this.context);
    },

    valid: () => {
      if (this.ignore) return new IgnoreThrow<VArray>(this);

      const fn = () => !Array.isArray(getValue(this.obj));
      return new Throw<VArray>(fn, this, this.context);
    },

    exists: () => {
      if (this.ignore) return new IgnoreThrow<VArray>(this);

      const fn = () => !doesFieldExists(this.obj, this.name);
      return new Throw<VArray>(fn, this, this.context);
    },
  };

  public of = {
    //scalar types
    scalars: (fn: (v: VScalar) => void): VArray => {
      //only execute if is array
      if (getValue(this.obj) && Array.isArray(getValue(this.obj))) {
        getValue(this.obj).forEach((val, it, arr) => {
          fn(new VScalar(it, setValue(this.obj, it, this.optional), this.optional, this.context, this.ignore));
        });
      }
      return this;
    },
    arrays: (fn: (v: VArray) => void): VArray => {
      //only execute if is array
      if (getValue(this.obj) && Array.isArray(getValue(this.obj))) {
        getValue(this.obj).forEach((val, it, arr) => {
          fn(new VArray(it, setValue(this.obj, it, this.optional), this.optional, this.context, this.ignore));
        });
      }
      return this;
    },
    objects: (fn: (v: VObject) => void): VArray => {
      //only execute if is array
      if (getValue(this.obj) && Array.isArray(getValue(this.obj))) {
        getValue(this.obj).forEach((val, it, arr) => {
          fn(new VObject(it, setValue(this.obj, it, this.optional), this.optional, this.context, this.ignore));
        });
      }
      return this;
    },
  };
}

/**
 * This functions return the value that the obj function has.
 * - If the return is the value, everything is fine.
 * - If the return is null, it means the key was not found
 * - If the return is undefined, it means that part of the path does not exist
 * @param obj
 */
function getValue(obj: () => [any, any, boolean]): any {
  const result = obj();

  const value = result[0];
  const exists = result[1];

  if (!exists) {
    return undefined;
  }
  return value;
}

/**
 * Check if the path exists
 * @param obj
 * @returns
 */
function doesPathExists(obj: () => [any, any, boolean]): boolean {
  const result = obj();
  const exists = result[2];

  return exists;
}

function shouldIgnore(obj: () => [any, any, boolean], optional: boolean, name: string): boolean {
  //in case of the path so far exists
  if (doesPathExists(obj)) {
    if (!doesFieldExists(obj, name)) return optional;
  }
  return true;
}

/**
 * Check if the field exists.
 * @param obj
 */
function doesFieldExists(obj: () => [any, any, boolean], name: string): boolean {
  const result = obj();

  const value = result[0];
  const object = result[1];
  const exists = result[2];

  return Object.prototype.hasOwnProperty.call(object, name);
}

/**
 * This method controls the result based on the path existing
 * @param obj - the object function, containing two results: the result and if path exists
 * @param name - the field name to the next iteration
 * @returns
 */
function setValue(obj: () => [any, any, boolean], name: string, optional: boolean): () => [any, any, boolean] {
  const result = obj();

  const value = result[0];
  const object = result[1];
  const exists = result[2];

  if (!exists || value == null || value == undefined) {
    if (optional) return () => [undefined, object, false];
    throw new CustomError(422, 1143, `required field ${name} not supplied`);
  }

  if (!Object.prototype.hasOwnProperty.call(value, name)) {
    return () => [undefined, object, false];
  }

  return () => [value[name], value, true];
}

function isNotNull(obj: any) {
  return obj !== null && obj !== undefined;
}

export enum FieldType {
  Optional,
  Required,
}

export enum LenghType {
  In,
  Out,
}

export enum ThrowType {
  Single,
  Multiple,
}
