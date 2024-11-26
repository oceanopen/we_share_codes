/* eslint-disable unused-imports/no-unused-vars */
{
    // 判断参数是否为 string 类型, 返回布尔值
    const isString = (s: unknown): boolean => {
        return typeof s === 'string';
    };

    // 直接使用转大写方法, 报错
    const upperCase = (str: unknown) => {
    // str.toUpperCase()
    // 类型“unknown”上不存在属性“toUpperCase”。
    };

    // 判断参数是否为字符串, 若是, 则再调用转大写方法, 依然报错
    const ifUpperCase = (str: unknown) => {
    // 这种虽然没有问题, 但遇到复杂的类型判断, 就难以处理了
        if (typeof str === 'string') {
            str.toUpperCase();
        }

        if (isString(str)) {
            // str.toUpperCase()
            // 报错:类型“unknown”上不存在属性“toUpperCase”
        }
    };
}

{
    // 判断参数是否为string类型, 返回布尔值
    const isString = (s: unknown): s is string => {
        return typeof s === 'string';
    };

    // 判断参数是否为字符串,是在调用转大写方法
    const ifUpperCase = (str: unknown) => {
        if (isString(str)) {
            str.toUpperCase();
            // (parameter) str: string
        }
    };
}

{
    // 接口 A
    interface IA {
        name: string;
        age: number;
    }

    // 接口 B
    interface IB {
        name: string;
        phone: number;
    }

    // 推断类型
    const obj1 = { name: 'andy', age: 2 };
    // const obj1: { name: string; age: number; }

    const obj2 = { name: 'andy', phone: 2 };
    // const obj2: { name: string; phone: number; }

    // 手动定义 arr 为联合类型数组
    const arr = new Array<IA | IB>(obj1, obj2);
    // const arr: (IA | IB)[]

    // 自动推断 arr2 为联合类型数组
    const arr2 = [<IA>obj1, <IB>obj2];
    // const arr2: (IA | IB)[]

    // 或者, 自动推断 arr3 为联合类型数组
    const arr3 = [...Array.from({ length: 1 }).fill(obj1), ...(<IB[]>[obj2])];
    // const arr3: (IA | IB)[]

    const target = arr[0];
    // const target: IA | IB

    // Ok 获取两个结构共有的属性
    console.log(target.name);

    // 获取两个接口不同的属性报错:
    // console.log(target.phone)
    // 报错: 类型“IA | IB”上不存在属性“phone”。类型“IA”上不存在属性“phone”。

    // console.log(target.age)
    // 报错:  类型“IA | IB”上不存在属性“age”。类型“IB”上不存在属性“age”。

    // 使用断言
    console.log((target as IB).phone);
    console.log((<IA>target).age);

    /**
     * 通过使用in运算符 的条件判断, 缩小 target 类型
     */
    if ('phone' in target) {
        console.log(target.phone);
    // const target: IB
    }
    if ('age' in target) {
        console.log(target.age);
    // const target: IA
    }

  /**
   * 类型谓词
   */
  type IUnionAB = IA | IB; // 联合类型
  // 自定义类型保护函数
  const isIA = (item: IUnionAB): item is IA => {
      return (item as IA).age !== undefined;
  };
  const isIB = (item: IUnionAB): item is IB => {
      return (item as IB).phone !== undefined;
  };
  // 判断target 属于哪个类型
  if (isIA(target)) {
      console.log(target.age); // target 的类型为 IA
  } else if (isIB(target)) {
      console.log(target.phone); // target 的类型为 IB
  }

  /**
   * 通过泛型定义通用类型保护函数
   */
  const isOfType = <T>(target: unknown, prop: keyof T): target is T => {
      return (target as T)[prop] !== undefined;
  };
  // 类型保护
  if (isOfType<IA>(target, 'age')) {
      console.log(target.age);
  } else if (isOfType<IB>(target, 'phone')) {
      console.log(target.phone);
  }
}
