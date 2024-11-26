/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-lone-blocks */
{
    // 接口
    interface Sister {
        name: string;
        age: number;
    }
    interface SetSister {
        (name: string, age: number): void;
    }
}
{
    // 类型别名
    interface Sister {
        name: string;
        age: number;
    }
  type SetSister = (name: string, age: number) => void;
}

{
    // 接口
    interface SisterAn {
        name: string;
    }

    // 类型别名
    interface SisterRan {
        age: number;
    }

    // 接口扩展接口
    interface Sister extends SisterAn {
        age: number;
    }

  // 类型别名扩展类型别名
  type SisterPro = SisterRan & {
      name: string;
  };

  // 接口扩展类型别名
  interface Sister2 extends SisterRan {
      name: string;
  }

  // 类型别名扩展接口
  type SisterPro2 = SisterAn & {
      age: number;
  };
}

{
  type Name = string;
  type Text = string | { text: string };
  type Coordinates = [number, number];
}

{
    // 接口扩展
    interface SisterAn {
        name: string;
    }
    interface Sister extends SisterAn {
        age: number;
    }

    // 类型别名扩展
    interface SisterRan {
        age: number;
    }
  type SisterPro = SisterRan & {
      name: string;
  };
}

{
    // 接口扩展
    interface SisterAn {
        name: string;
        age: string;
    }

    // 接口“Sister”错误扩展接口“SisterAn”。
    // 属性“age”的类型不兼容。
    // 不能将类型“number”分配给类型“string”。ts(2430)
    // interface Sister extends SisterAn {
    //   name: string
    //   age: number
    // }
}

{
    // 类型别名扩展
    interface SisterRan {
        name: string;
        age: string;
    }
  type SisterPro = SisterRan & {
      name: string;
      age: number;
  };
}

{
    interface Sister {
        name: string;
    }
    interface Sister {
        age: number;
    }

    // 类型 "{ name: string; }" 中缺少属性 "age"，但类型 "Sister" 中需要该属性。ts(2741)
    // const sisterAn: Sister = {
    //   name: 'sisterAn',
    // }

    // 正确
    const sisterRan: Sister = {
        name: 'sisterRan',
        age: 12,
    };
}

{
    // 标识符“Sister”重复。ts(2300)
    interface Sister {
        name: string;
    }

    // 标识符“Sister”重复。ts(2300)
    // type Sister = {
    //   age: number
    // }
}

{
    interface Foo {
        prop: string;
    }

    interface Bar { prop: string }
}

{
    // 接口扩展
    interface Sister {
        sex: number;
    }

    // 接口“SisterAn”错误扩展接口“Sister”。
    // 属性“sex”的类型不兼容。
    // 不能将类型“string”分配给类型“number”。ts(2430)
    // interface SisterAn extends Sister {
    //   sex: string
    // }
}

{
    // 交叉类型
    interface Sister1 {
        sex: number;
    }

    interface Sister2 {
        sex: string;
    }

  // 不报错，此时的 SisterAn 是一个'number & string'类型，也就是 never
  type SisterAn = Sister1 & Sister2;
}
