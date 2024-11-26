/* eslint-disable unused-imports/no-unused-vars */
const someValue: any = 123;
const strLength: number = (someValue as string).length;

interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig) {
    // 不能将类型“null”分配给类型“string | undefined”。ts(2322)
    // config.color = null

    // config.color = undefined

    console.log(config.color);

    // 属性读取
    if (config.color) {
        console.log(config.color.length);
    }
    console.log('config.color?.length:');
    console.log(config.color?.length);

    console.log('(config.color as string).length:');
    console.log((config.color as string).length);

    console.log('config.color!.length:');
    console.log(config.color!.length);
}

interface Cat {
    action: string;
}
interface Dog {
    action: string;
}
type Animal = Cat | Dog;
const action: Animal = {} as Cat;
