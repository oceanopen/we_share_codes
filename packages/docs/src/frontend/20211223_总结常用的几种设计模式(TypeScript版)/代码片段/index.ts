/* eslint-disable no-lone-blocks */
/* eslint-disable unused-imports/no-unused-vars */
/**
 * 文件执行命令
 * npx ts-node index.ts
 */

{
  /**
   * 单例模式
   */

  // 饿汉式
  class Singleton1 {
    // 1. 构造器私有化，外部不能 new
    private constructor() {}

    // 2. 本类内部创建对象实例化
    private static instance: Singleton1 = new Singleton1();

    // 3. 提供一个公有的静态方法，返回实例对象
    public static getInstance(): Singleton1 {
      return this.instance;
    }
  }
  console.log(Singleton1.getInstance()); // Singleton1 {}

  // 懒汉式
  class Singleton2 {
    private constructor() {}

    private static instance: Singleton2 | null = null;

    public static getInstance(): Singleton2 {
      if (this.instance === null) {
        this.instance = new Singleton2();
      }

      return this.instance;
    }
  }
  console.log(Singleton2.getInstance()); // Singleton2 {}
}

{
  /**
   * 简单工厂模式
   */

  // 抽象产品接口
  interface Product {}

  // 具体产品一
  class ConcreteProduct1 implements Product {
    constructor() {}
  }

  // 具体产品二
  class ConcreteProduct2 implements Product {
    constructor() {}
  }

  // 简单工厂
  class SimpleFactory {
    public static createProduct(type: number): Product | null {
      let product: Product | null = null;
      if (type === 1) {
        product = new ConcreteProduct1();
      }
      else if (type === 2) {
        product = new ConcreteProduct2();
      }

      return product;
    }
  }

  // 使用
  const product = SimpleFactory.createProduct(1);
  console.log(product); // ConcreteProduct1 {}
}

{
  /**
   * 工厂方法模式
   */

  // 抽象产品接口
  interface Product2 {
    method1: () => void;
    method2: () => void;
  }

  // 具体产品一
  class ConcreteProduct_1 implements Product2 {
    constructor() {}
    method1() {}
    method2() {}
  }

  // 具体产品二
  class ConcreteProduct_2 implements Product2 {
    constructor() {}
    method1() {}
    method2() {}
  }

  // 抽象工厂
  abstract class Creator {
    public abstract createProduct(type: number): Product2 | null;
  }

  // 具体工厂
  class ConcreteCreator extends Creator {
    constructor() {
      super();
    }

    public createProduct(type: number): Product2 | null {
      let product: Product2 | null = null;
      if (type === 1) {
        product = new ConcreteProduct_1();
      }
      else if (type === 2) {
        product = new ConcreteProduct_2();
      }
      return product;
    }
  }

  // 使用
  const creator: ConcreteCreator = new ConcreteCreator();
  const myProduct: Product2 | null = creator.createProduct(1);
}

{
  /**
   * 抽象工厂模式
   */

  // 抽象工厂接口
  interface AbstractFactory {
    createProductA: () => AbstractProductA;
    createProductB: () => AbstractProductB;
  }

  // 抽象产品 A 接口
  interface AbstractProductA {}

  // 抽象产品 B 接口
  interface AbstractProductB {}

  // 具体工厂1
  class ConcreteFactory1 implements AbstractFactory {
    constructor() {}
    public createProductA(): AbstractProductA {
      return new ConcreteProductA1();
    }

    public createProductB(): AbstractProductB {
      return new ConcreteProductB1();
    }
  }

  // 具体工厂2
  class ConcreteFactory2 implements AbstractFactory {
    constructor() {}
    public createProductA(): AbstractProductA {
      return new ConcreteProductA2();
    }

    public createProductB(): AbstractProductB {
      return new ConcreteProductB2();
    }
  }

  // 具体产品 A1
  class ConcreteProductA1 implements AbstractProductA {}
  // 具体产品 A2
  class ConcreteProductA2 implements AbstractProductA {}
  // 具体产品 B1
  class ConcreteProductB1 implements AbstractProductB {}
  // 具体产品 B2
  class ConcreteProductB2 implements AbstractProductA {}

  // 使用
  const factory1: AbstractFactory = new ConcreteFactory1();
  const factory2: AbstractFactory = new ConcreteFactory2();
  const productA1: AbstractProductA = factory1.createProductA();
  const productA2: AbstractProductA = factory2.createProductA();
  const productB1: AbstractProductB = factory1.createProductB();
  const productB2: AbstractProductB = factory2.createProductB();
}

{
  /**
   * 原型模式
   */

  interface Prototype {
    clone: () => Prototype;
  }

  class Dog implements Prototype {
    public name: string;
    public birthYear: number;
    public sex: string;
    public presentYear: number;
    constructor() {
      this.name = 'xiaohuang';
      this.birthYear = 2018;
      this.sex = '女';
      this.presentYear = 2019;
    }

    public getDiscription(): string {
      return `狗狗叫${this.name},性别${this.sex},${this.birthYear}年出生${this.presentYear - this.birthYear}岁了`;
    }

    // 实现复制
    public clone(): Dog {
      return Object.create(this);
    }
  }

  // 使用
  const dog = new Dog();
  const dog2 = Object.create(dog);
  dog2.presentYear = 2020;
  const dog3 = dog.clone();
  dog3.presentYear = 2021;

  console.log(dog.getDiscription()); // 狗狗叫xiaohuang,性别女,2018年出生1岁了
  console.log(dog2.getDiscription()); // 狗狗叫xiaohuang,性别女,2018年出生2岁了
  console.log(dog3.getDiscription()); // 狗狗叫xiaohuang,性别女,2018年出生3岁了
}

{
  /**
   * 建造者模式
   */

  // 抽象建造者
  abstract class Builder {
    public abstract buildPartA(): void;
    public abstract buildPartB(): void;
    public abstract buildPartC(): void;
    public abstract buildProduct(): Product;
  }

  // 具体建造者
  class ConcreteBuilder extends Builder {
    private product: Product;
    constructor(product: Product) {
      super();
      this.product = product;
    }

    public buildPartA(): void {}
    public buildPartB(): void {}
    public buildPartC(): void {}

    // 最终组建一个产品
    public buildProduct(): Product {
      return this.product;
    }
  }

  // 产品角色
  class Product {
    public doSomething(): void {
      // 独立业务
    }
  }

  // 指挥者
  class Director {
    private _builder: Builder;
    constructor(builder: Builder) {
      this._builder = builder;
    }

    set builder(builder: Builder) {
      this._builder = builder;
    }

    get builder() {
      return this._builder;
    }

    // 将处理建造的流程交给指挥者
    public constructorProduct() {
      this._builder.buildPartA();
      this._builder.buildPartB();
      this._builder.buildPartC();
      return this._builder.buildProduct();
    }
  }

  // 使用
  const builder: Builder = new ConcreteBuilder(new Product());
  const director: Director = new Director(builder);
  const product: Product = director.constructorProduct();
}

{
  /**
   * 适配器模式
   */

  // 类适配器
  {
    // 目标对象
    interface Target {
      request: () => void;
    }
    // 被适配者
    class Adaptee {
      constructor() {}
      // 这是源角色，有自己的的业务逻辑
      public specificRequest(): void {}
    }
    // 适配器
    class Adapter extends Adaptee implements Target {
      constructor() {
        super();
      }

      public request(): void {
        super.specificRequest();
      }
    }

    const target: Target = new Adapter();
    target.request();
  }

  // 对象适配器
  {
    // 目标对象
    interface Target {
      request: () => void;
    }
    // 被适配者
    class Adaptee {
      constructor() {}
      // 这是源角色，有自己的的业务逻辑
      public specificRequest(): void {}
    }
    // 适配器
    class Adapter implements Target {
      private adaptee: Adaptee;
      constructor(adaptee: Adaptee) {
        this.adaptee = adaptee;
      }

      public request(): void {
        this.adaptee.specificRequest();
      }
    }
    // 使用
    const target: Target = new Adapter(new Adaptee());
    target.request();
  }

  // 接口适配器
  {
    interface Adaptee {
      operation1: () => void;
      operation2: () => void;
    }

    abstract class AbsAdapter implements Adaptee {
      public operation1(): void {}
      public operation2(): void {}
    }

    class UseClass extends AbsAdapter {
      public operation1(): void {} // 重写该类
    }
  }
}

{
  /**
   * 桥接模式
   */

  // 实现接口角色
  interface Implementor {
    doSomething: () => void;
    doAnything: () => void;
  }

  // 具体实现角色
  class ConcreteImplementor1 implements Implementor {
    public doSomething(): void {}
    public doAnything(): void {}
  }
  class ConcreteImplementor2 implements Implementor {
    public doSomething(): void {}
    public doAnything(): void {}
  }

  // 抽象类
  abstract class Abstraction {
    private imp: Implementor;
    constructor(imp: Implementor) {
      this.imp = imp;
    }

    // 自身的行为和属性
    public request(): void {
      this.imp.doSomething();
    }
  }
  // 具体抽象化角色
  class RefinedAbstraction extends Abstraction {
    constructor(imp: Implementor) {
      super(imp);
    }

    public request(): void {
      // 自己写一些处理业务
      super.request();
    }
  }

  // 调用
  // 定义一个实现化角色
  const imp: Implementor = new ConcreteImplementor1();
  // 定义一个抽象化角色
  const abs: Abstraction = new RefinedAbstraction(imp);
  // 执行上下文
  abs.request();
}

{
  /**
   * 装饰者模式
   */

  // 抽象构件
  abstract class Component {
    public abstract operate(): void;
  }

  // 具体构件
  class ConcreteComponent extends Component {
    public operate(): void {
      console.log('do something');
    }
  }

  // 装饰角色
  abstract class Decorator extends Component {
    private component: Component | null = null;
    constructor(component: Component) {
      super();
      this.component = component;
    }

    public operate(): void {
      this.component?.operate();
    }
  }

  // 具体装饰者
  class ConcreteDecoratorA extends Decorator {
    constructor(component: Component) {
      super(component);
    }

    // 定义自己的修饰方法
    private methodA(): void {
      console.log('methodA 修饰');
    }

    // 重写父类方法
    public operate(): void {
      this.methodA();
      super.operate();
    }
  }

  class ConcreteDecoratorB extends Decorator {
    constructor(component: Component) {
      super(component);
    }

    // 定义自己的修饰方法
    private methodB(): void {
      console.log('methodB 修饰');
    }

    // 重写父类方法
    public operate(): void {
      this.methodB();
      super.operate();
    }
  }

  const main = () => {
    let component: Component = new ConcreteComponent();
    // 第一次装饰
    component = new ConcreteDecoratorA(component);
    // 第二次装饰
    component = new ConcreteDecoratorB(component);
    // 装饰后运行
    component.operate();
  };

  main();
  // methodB 修饰
  // methodA 修饰
  // do something
}

{
  /**
   * 组合模式
   */

  abstract class Component {
    protected name: string;
    constructor(name: string) {
      this.name = name;
    }

    public abstract doOperation(): void;

    public add(component: Component): void {}

    public remove(component: Component): void {}

    public getChildren(): Array<Component> {
      return [];
    }
  }

  class Composite extends Component {
    // 构件容器
    private componentList: Component[];
    constructor(name: string) {
      super(name);
      this.componentList = [];
    }

    public doOperation(): void {
      console.log(`这是容器${this.name}，处理一些逻辑业务！`);
    }

    public add(component: Component): void {
      this.componentList.push(component);
    }

    public remove(component: Component): void {
      const componentIndex = this.componentList.findIndex((value: Component) => {
        return value === component;
      });
      this.componentList.splice(componentIndex, 1);
    }

    public getChildren(): Array<Component> {
      return this.componentList;
    }
  }

  class Leaf extends Component {
    constructor(name: string) {
      super(name);
    }

    public doOperation(): void {
      console.log(`这是叶子节点${this.name}，处理一些逻辑业务！`);
    }
  }

  const main = () => {
    const root: Component = new Composite('root');
    const node1: Component = new Leaf('1');
    const node2: Component = new Composite('2');
    const node3: Component = new Leaf('3');

    root.add(node1);
    root.add(node2);
    root.add(node3);

    const node2_1: Component = new Leaf('2_1');
    node2.add(node2_1);

    const children1 = root.getChildren();
    console.log(children1);
    // [
    //   Leaf { name: '1' },
    //   Composite { name: '2', componentList: [ [Leaf] ] },
    //   Leaf { name: '3' }
    // ]

    root.remove(node2);

    const children2 = root.getChildren();
    console.log(children2);
    // [ Leaf { name: '1' }, Leaf { name: '3' } ]
  };

  main();
}

{
  /**
   * 外观模式
   */

  class SubSystemA {
    public doOperationA(): void {
      console.log('子系统 A 的举动');
    }
  }

  class SubSystemB {
    public doOperationB(): void {
      console.log('子系统 B 的举动');
    }
  }

  class Facade {
    private subSystemA: SubSystemA;
    private subSystemB: SubSystemB;
    constructor() {
      this.subSystemA = new SubSystemA();
      this.subSystemB = new SubSystemB();
    }

    public doOperation(): void {
      this.subSystemA.doOperationA();
      this.subSystemB.doOperationB();
    }
  }

  const main = () => {
    const facade: Facade = new Facade();
    facade.doOperation();
  };

  main();
  // 子系统 A 的举动
  // 子系统 B 的举动
}

{
  /**
   * 享元模式
   */

  abstract class Flyweight {
    public abstract doOperation(extrinsicState: string): void;
  }

  class ConcreteFlyweight extends Flyweight {
    private intrinsicState: string;
    constructor(intrinsicState: string) {
      super();
      this.intrinsicState = intrinsicState;
    }

    public doOperation(extrinsicState: string): void {
      console.log(`这是具体享元角色，内部状态为${this.intrinsicState},外部状态为${extrinsicState}`);
    }
  }

  interface FlyweightObject {
    [key: string]: Flyweight;
  }

  class FlyweightFactory {
    private flyweights: FlyweightObject;
    constructor() {
      this.flyweights = {};
    }

    public getFlyweight(intrinsicState: string): Flyweight {
      if (!this.flyweights[intrinsicState]) {
        const flyweight: Flyweight = new ConcreteFlyweight(intrinsicState);
        this.flyweights[intrinsicState] = flyweight;
      }
      return this.flyweights[intrinsicState];
    }
  }

  const main = () => {
    const factory: FlyweightFactory = new FlyweightFactory();
    const flyweight1: Flyweight = factory.getFlyweight('aa');
    const flyweight2: Flyweight = factory.getFlyweight('bb');
    flyweight1.doOperation('x');
    flyweight2.doOperation('y');
  };

  main();
  // 这是具体享元角色，内部状态为aa,外部状态为x
  // 这是具体享元角色，内部状态为bb,外部状态为y
}

{
  /**
   * 代理模式
   */

  {
    // 静态代理
    interface Subject {
      doOperation: () => void;
    }

    class RealSubject implements Subject {
      public doOperation() {
        console.log('我是RealSubject类，正在执行');
      }
    }

    class MyProxy implements Subject {
      private target: Subject;
      constructor(realSubject: Subject) {
        this.target = realSubject;
      }

      public doOperation() {
        console.log('我是代理类');
        this.target.doOperation();
      }
    }

    const main = () => {
      const realSubject: Subject = new RealSubject();
      const myProxy: Subject = new MyProxy(realSubject);

      myProxy.doOperation();
    };

    main(); // 我是RealSubject类，正在执行
  }

  {
    // 动态代理
    interface Subject {
      doOperation: () => void;
    }

    class RealSubject implements Subject {
      constructor() {}

      public doOperation(): void {
        console.log('我是RealSubject类，正在执行');
      }
    }

    class ProxyFactory {
      private target: Subject;
      constructor(target: Subject) {
        this.target = target;
      }

      public getProxyInstance(): Subject {
        return new Proxy(this.target, {
          get: (target, propKey: keyof Subject) => {
            // 做的一些拦截处理
            return target[propKey];
          },
        });
      }
    }

    const main = () => {
      const target: Subject = new RealSubject();
      const proxyInstance: Subject = new ProxyFactory(target).getProxyInstance();

      proxyInstance.doOperation();
    };

    main(); // 我是RealSubject类，正在执行
  }
}

{
  /**
   * 模板方法模式
   */

  abstract class AbstractClass {
    constructor() {}

    // 模板方法
    public template(): void {
      this.operation1();
      this.hookMethod() && this.operation2();
      this.operation3();
    }

    // 基本方法
    protected operation1(): void {
      console.log('使用了方法operation1');
    }

    protected operation2(): void {
      console.log('使用了方法operation2');
    }

    protected operation3(): void {
      console.log('使用了方法operation3');
    }

    // 钩子方法
    protected hookMethod(): boolean {
      return true;
    }
  }

  class ConcreteClassA extends AbstractClass {
    protected operation2(): void {
      console.log('对该方法operation2进行了修改再使用');
    }

    protected operation3(): void {
      console.log('对该方法operation3进行了修改再使用');
    }
  }

  class ConcreteClassB extends AbstractClass {
    // 覆盖钩子方法
    protected hookMethod(): boolean {
      return false;
    }
  }

  const main = () => {
    const class1: AbstractClass = new ConcreteClassA();
    const class2: AbstractClass = new ConcreteClassB();

    class1.template();
    // 使用了方法operation1
    // 对该方法operation2进行了修改再使用
    // 对该方法operation3进行了修改再使用

    class2.template();
    // 使用了方法operation1
    // 使用了方法operation3
  };

  main();
}

{
  /**
   * 命令模式
   */

  interface Command {
    execute: () => void;
    undo: () => void;
  }

  // 开启命令
  class ConcreteCommandOn implements Command {
    private receiver: Receiver;
    constructor(receiver: Receiver) {
      this.receiver = receiver;
    }

    // 执行命令的方法
    public execute(): void {
      this.receiver.actionOn();
    }

    // 撤销命令的方法
    public undo(): void {
      this.receiver.actionOff();
    }
  }

  // 关闭命令
  class ConcreteCommandOff implements Command {
    private receiver: Receiver;
    constructor(receiver: Receiver) {
      this.receiver = receiver;
    }

    // 执行命令的方法
    public execute(): void {
      this.receiver.actionOff();
    }

    // 撤销命令的方法
    public undo(): void {
      this.receiver.actionOn();
    }
  }

  // 空命令（省去判空操作）
  class NoCommand implements Command {
    public execute(): void {}
    public undo(): void {}
  }

  class Receiver {
    public actionOn(): void {
      console.log('我是命令接收者，开启了某动作');
    }

    public actionOff(): void {
      console.log('我是命令接收者，关闭了某动作');
    }
  }

  class Invoker {
    private onCommands: Array<Command>;
    private offCommands: Array<Command>;
    private undoCommand: Command;
    private slotNum: number = 7;
    constructor() {
      this.undoCommand = new NoCommand();
      this.onCommands = [];
      this.offCommands = [];

      for (let i = 0; i < this.slotNum; i++) {
        this.onCommands[i] = new NoCommand();
        this.offCommands[i] = new NoCommand();
      }
    }

    public setCommand(index: number, onCommand: Command, offCommand: Command): void {
      this.onCommands[index] = onCommand;
      this.offCommands[index] = offCommand;
    }

    // 开启
    public on(index: number): void {
      this.onCommands[index].execute(); // 调用相应方法
      // 记录这次操作，用于撤销
      this.undoCommand = this.onCommands[index];
    }

    // 关闭
    public off(index: number): void {
      this.offCommands[index].execute();
      this.undoCommand = this.offCommands[index];
    }

    // 撤销
    public undo(): void {
      this.undoCommand.undo();
    }
  }

  const main = () => {
    // 创建接收者
    const receiver: Receiver = new Receiver();

    // 创建命令
    const commandOn: Command = new ConcreteCommandOn(receiver);
    const commandOff: Command = new ConcreteCommandOff(receiver);

    // 创建调用者
    const invoker: Invoker = new Invoker();
    invoker.setCommand(0, commandOn, commandOff);

    invoker.on(0); // 我是命令接收者，开启了某动作
    invoker.off(0); // 我是命令接收者，关闭了某动作
    invoker.undo(); // 我是命令接收者，开启了某动作
  };

  main();
}

{
  /**
   * 访问者模式
   */

  abstract class AbstractElement {
    // 定义业务逻辑
    public abstract doSomething(): void;
    // 允许谁来访问
    public abstract accept(visitor: Visitor): void;
  }

  class ConcreteElement1 extends AbstractElement {
    public doSomething(): void {
      console.log('ConcreteElement1执行的业务逻辑');
    }

    public accept(visitor: Visitor): void {
      visitor.visit1(this);
    }
  }

  class ConcreteElement2 extends AbstractElement {
    public doSomething(): void {
      console.log('ConcreteElement1执行的业务逻辑');
    }

    public accept(visitor: Visitor): void {
      visitor.visit2(this);
    }
  }

  abstract class Visitor {
    public abstract visit1(element1: ConcreteElement1): void;
    public abstract visit2(element2: ConcreteElement2): void;
  }

  class ConcreteVistor extends Visitor {
    public visit1(element1: ConcreteElement1): void {
      console.log('进入处理element1');
      element1.doSomething();
    }

    public visit2(element2: ConcreteElement2): void {
      console.log('进入处理element2');
      element2.doSomething();
    }
  }

  // 数据结构，管理很多元素（ConcreteElement1，ConcreteElement1）
  class ObjectStructure {
    private listSet: Set<AbstractElement>;
    constructor() {
      this.listSet = new Set();
    }

    // 增加
    public attach(element: AbstractElement): void {
      this.listSet.add(element);
    }

    // 删除
    public detach(element: AbstractElement): void {
      this.listSet.delete(element);
    }

    // 显示
    public display(visitor: Visitor): void {
      for (const element of this.listSet.values()) {
        element.accept(visitor);
      }
    }
  }

  const main = () => {
    const objectStructure: ObjectStructure = new ObjectStructure();
    objectStructure.attach(new ConcreteElement1());
    objectStructure.attach(new ConcreteElement2());

    const visitor: Visitor = new ConcreteVistor();

    objectStructure.display(visitor);
  };

  main();
  // 进入处理element1
  // ConcreteElement1执行的业务逻辑
  // 进入处理element2
  // ConcreteElement1执行的业务逻辑
}

{
  /**
   * 迭代器模式
   */

  interface AbstractIterator {
    next: () => any;
    hasNext: () => boolean;
  }

  class ConcreteIterator implements AbstractIterator {
    private list: any[];
    public cursor: number = 0;
    constructor(array: any[]) {
      this.list = array;
    }

    public next(): any {
      return this.hasNext() ? this.list[this.cursor++] : null;
    }

    public hasNext(): boolean {
      return this.cursor < this.list.length;
    }
  }

  interface Aggregate {
    add: (value: any) => void;
    remove: (value: any) => void;
    createIterator: () => AbstractIterator;
  }

  class ConcreteAggregate implements Aggregate {
    // 容纳对象的容器
    private list: any[];
    constructor() {
      this.list = [];
    }

    add(value: any): void {
      this.list.push(value);
    }

    remove(value: any): void {
      const index = this.list.findIndex((listValue) => {
        return value === listValue;
      });
      this.list.splice(index, 1);
    }

    createIterator(): AbstractIterator {
      return new ConcreteIterator(this.list);
    }
  }

  const main = () => {
    const aggregate: Aggregate = new ConcreteAggregate();
    aggregate.add('first');
    aggregate.add('second');

    const iterator: AbstractIterator = aggregate.createIterator();
    while (iterator.hasNext()) {
      console.log(iterator.next());
    }
  };

  main();
  // first
  // second
}

{
  /**
   * 观察者模式
   */

  interface AbstractSubject {
    registerObserver: (observer: Observer) => void;
    remove: (observer: Observer) => void;
    notifyObservers: (...args: any[]) => void;
  }

  class ConcreteSubject implements AbstractSubject {
    private observers: Array<Observer>;

    constructor() {
      this.observers = [];
    }

    public registerObserver(observer: Observer): void {
      this.observers.push(observer);
    }

    public remove(observer: Observer): void {
      const observerIndex = this.observers.findIndex((value) => {
        return value === observer;
      });

      observerIndex >= 0 && this.observers.splice(observerIndex, 1);
    }

    public notifyObservers(...args: any[]): void {
      this.observers.forEach(observer => observer.update(...args));
    }
  }

  interface Observer {
    update: (...value: any[]) => void;
  }

  class ConcreteObserver1 implements Observer {
    public update(...value: any[]): void {
      console.log('已经执行更新操作1，值为：', ...value);
    }
  }
  class ConcreteObserver2 implements Observer {
    public update(...value: any[]): void {
      console.log('已经执行更新操作2，值为：', ...value);
    }
  }

  const main = () => {
    const subject: AbstractSubject = new ConcreteSubject();
    const observer1: Observer = new ConcreteObserver1();
    const observer2: Observer = new ConcreteObserver2();

    subject.registerObserver(observer1);
    subject.registerObserver(observer2);

    subject.notifyObservers(1, 2, 3);
  };

  main();
  // 已经执行更新操作1，值为： 1 2 3
  // 已经执行更新操作2，值为： 1 2 3
}

{
  /**
   * 发布订阅模式
   */

  interface Publish {
    registerObserver: (eventType: string, subscribe: Subscribe) => void;
    remove: (eventType: string, subscribe?: Subscribe) => void;
    notifyObservers: (eventType: string) => void;
  }
  interface SubscribesObject {
    [key: string]: Array<Subscribe>;
  }
  class ConcretePublish implements Publish {
    private subscribes: SubscribesObject;

    constructor() {
      this.subscribes = {};
    }

    registerObserver(eventType: string, subscribe: Subscribe): void {
      if (!this.subscribes[eventType]) {
        this.subscribes[eventType] = [];
      }

      this.subscribes[eventType].push(subscribe);
    }

    remove(eventType: string, subscribe?: Subscribe): void {
      const subscribeArray = this.subscribes[eventType];
      if (subscribeArray) {
        if (!subscribe) {
          delete this.subscribes[eventType];
        }
        else {
          const index = subscribeArray.indexOf(subscribe);
          index >= 0 && subscribeArray.splice(index, 1);
        }
      }
    }

    notifyObservers(eventType: string, ...args: any[]): void {
      const subscribes = this.subscribes[eventType];
      if (subscribes) {
        subscribes.forEach(subscribe => subscribe.update(...args));
      }
    }
  }

  interface Subscribe {
    update: (...value: any[]) => void;
  }

  class ConcreteSubscribe1 implements Subscribe {
    public update(...value: any[]): void {
      console.log('已经执行更新操作1，值为：', ...value);
    }
  }
  class ConcreteSubscribe2 implements Subscribe {
    public update(...value: any[]): void {
      console.log('已经执行更新操作2，值为：', ...value);
    }
  }

  const main = () => {
    const publish = new ConcretePublish();
    const subscribe1 = new ConcreteSubscribe1();
    const subscribe2 = new ConcreteSubscribe2();

    publish.registerObserver('1', subscribe1);
    publish.registerObserver('2', subscribe2);

    publish.notifyObservers('2', 1, 2, 3);
  };

  main();
  // 已经执行更新操作2，值为： 1 2 3
}

{
  /**
   * 中介者模式
   */

  abstract class Colleague {
    public abstract onEvent(eventType: string): void;
  }

  class ConcreteColleagueA extends Colleague {
    private mediator: Mediator;
    constructor(mediator: Mediator) {
      super();
      this.mediator = mediator;
    }

    public onEvent(eventType: string): void {
      this.mediator.doEvent(eventType);
    }

    // 自己的一些事情
    public doSomething(): void {
      console.log('A被运行了');
    }
  }

  class ConcreteColleagueB extends Colleague {
    private mediator: Mediator;
    constructor(mediator: Mediator) {
      super();
      this.mediator = mediator;
    }

    public onEvent(eventType: string): void {
      this.mediator.doEvent(eventType);
    }

    // 自己的一些事情
    public doSomething(): void {
      console.log('B被运行了');
    }
  }

  abstract class Mediator {
    protected _colleagueA?: ConcreteColleagueA;
    protected _colleagueB?: ConcreteColleagueB;

    set colleagueA(colleagueA: ConcreteColleagueA | undefined) {
      this._colleagueA = colleagueA;
    }

    get colleagueA() {
      return this._colleagueA;
    }

    set colleagueB(colleagueB: ConcreteColleagueB | undefined) {
      this._colleagueB = colleagueB;
    }

    get colleagueB() {
      return this._colleagueB;
    }

    public abstract doEvent(eventType: string): void;
  }

  class ConcreteMediator extends Mediator {
    // 1. 根据得到消息，完成对应任务
    // 2. 中介者在这个方法，协调各个具体的同事对象，完成任务
    public doEvent(eventType: string): void {
      switch (eventType) {
        case 'A': {
          this.doColleagueAEvent();
          break;
        }
        case 'B': {
          this.doColleagueBEvent();
          break;
        }
        default: {
          break;
        }
      }
    }

    // 相应业务逻辑
    public doColleagueAEvent(): void {
      this._colleagueA && this._colleagueA.doSomething();
      this._colleagueB && this._colleagueB.doSomething();
      console.log('A-B执行完毕');
    }

    public doColleagueBEvent(): void {
      this._colleagueB && this._colleagueB.doSomething();
      this._colleagueA && this._colleagueA.doSomething();
      console.log('B-A执行完毕');
    }
  }

  const main = () => {
    const mediator: Mediator = new ConcreteMediator();
    const myColleagueA: ConcreteColleagueA = new ConcreteColleagueA(mediator);
    const myColleagueB: ConcreteColleagueB = new ConcreteColleagueB(mediator);
    mediator.colleagueA = myColleagueA;
    mediator.colleagueB = myColleagueB;

    myColleagueA.onEvent('A'); // A-B执行完毕
    myColleagueB.onEvent('B'); // B-A执行完毕
  };

  main();
}

{
  /**
   * 备忘录模式
   */

  class Originator {
    private _state: string = '';
    constructor() {}

    get state() {
      return this._state;
    }

    set state(value) {
      this._state = value;
    }

    // 创建一个备忘录
    public createMemento(): Memento {
      console.log('创建了一个备忘录!');
      return new Memento(this._state);
    }

    // 恢复一个备忘录
    public recoverMemento(memento: Memento) {
      console.log('恢复了一个备忘录!');
      this.state = memento.state;
    }
  }

  class Memento {
    private _state: string;
    constructor(state: string) {
      this._state = state;
    }

    get state(): string {
      return this._state;
    }
  }

  class Caretaker {
    // 保存一次状态用此，保存多次用数组
    private memento?: Memento;

    public getMemento(): Memento | undefined {
      return this.memento;
    }

    public setMemento(memento: Memento) {
      this.memento = memento;
    }
  }

  const main = () => {
    // 定义发起人
    const originator: Originator = new Originator();
    // 定义守护者
    const caretaker: Caretaker = new Caretaker();

    // 创建一个备忘录
    originator.state = '123';
    const memento: Memento = originator.createMemento();
    // 将备忘录存储到守护者
    caretaker.setMemento(memento);

    originator.state = '456';
    console.log(originator.state);

    // 恢复一个备忘录
    originator.recoverMemento(memento);
    console.log(originator.state);
  };

  main();
  // 创建了一个备忘录!
  // 456
  // 恢复了一个备忘录!
  // 123
}

{
  /**
   * 解释器模式
   */

  // 以下是一个规则检验器实现，具有 and 和 or 规则，通过规则可以构建一颗解析树，用来检验一个文本是否满足解析树定义的规则。

  // 例如一颗解析树为 D And (A Or (B C))，文本 "D A" 或者 "A D" 满足该解析树定义的规则
  abstract class Expression {
    // 解释器方法为必须，这样子表达式可以递归判断
    public abstract interpreter(str: string): boolean;
  }

  class TerminalExpression extends Expression {
    private literal: string;
    constructor(str: string) {
      super();
      this.literal = str;
    }

    // 定义解释器方法
    // 判断规则为检测字符是否存在，所以顺序不影响结果
    public interpreter(str: string): boolean {
      for (const charVal of str) {
        if (charVal === this.literal) {
          return true;
        }
      }

      return false;
    }
  }

  class AndExpression extends Expression {
    private expression1: Expression;
    private expression2: Expression;

    constructor(expression1: Expression, expression2: Expression) {
      super();
      this.expression1 = expression1;
      this.expression2 = expression2;
    }

    public interpreter(str: string): boolean {
      return this.expression1.interpreter(str) && this.expression2.interpreter(str);
    }
  }

  class OrExpression extends Expression {
    private expression1: Expression;
    private expression2: Expression;

    constructor(expression1: Expression, expression2: Expression) {
      super();
      this.expression1 = expression1;
      this.expression2 = expression2;
    }

    public interpreter(str: string): boolean {
      return this.expression1.interpreter(str) || this.expression2.interpreter(str);
    }
  }

  // 构建检测表达式 D And (A Or (B C))
  function buildInterpreterTree() {
    const terminal1: Expression = new TerminalExpression('A');
    const terminal2: Expression = new TerminalExpression('B');
    const terminal3: Expression = new TerminalExpression('C');
    const terminal4: Expression = new TerminalExpression('D');

    // B And C
    const alternation1: Expression = new AndExpression(terminal2, terminal3);
    // A Or (B C)
    const alternation2: Expression = new OrExpression(terminal1, alternation1);
    // D And (A Or (B C))
    return new AndExpression(terminal4, alternation2);
  }

  const main = () => {
    const define: Expression = buildInterpreterTree();
    const context1: string = 'D A';
    const context2: string = 'D B C';
    const context3: string = 'A D';
    const context4: string = 'D C';
    const context5: string = 'C D B';

    console.log(define.interpreter(context1)); // true
    console.log(define.interpreter(context2)); // true
    console.log(define.interpreter(context3)); // true
    console.log(define.interpreter(context4)); // false
    console.log(define.interpreter(context5)); // true
  };

  main();
}

{
  /**
   * 状态模式
   */

  abstract class State {
    public abstract handle1(): void;
    public abstract handle2(): void;
  }

  class ConcreteState1 extends State {
    private context: Context;
    constructor(context: Context) {
      super();
      this.context = context;
    }

    // 本状态下需要处理的逻辑
    public handle1(): void {
      console.log('State1的状态需要处理的逻辑');
    }

    // 将进行状态转移
    public handle2(): void {
      this.context.currentState = this.context.STATE2;
      console.log('由状态state1转为state2');
    }
  }

  class ConcreteState2 extends State {
    private context: Context;
    constructor(context: Context) {
      super();
      this.context = context;
    }

    // 进行状态转移
    public handle1(): void {
      this.context.currentState = this.context.STATE1;
      console.log('由状态state2转为state1');
    }

    // 本状态下的处理逻辑
    public handle2(): void {
      console.log('State2的状态需要处理的逻辑');
    }
  }

  class Context {
    public STATE1: State = new ConcreteState1(this);
    public STATE2: State = new ConcreteState2(this);
    public currentState: State;

    constructor() {
      this.currentState = this.STATE1;
    }

    public doOperation1() {
      this.currentState?.handle1();
      this.currentState?.handle2();
    }

    public doOperation2() {
      this.currentState?.handle2();
      this.currentState?.handle1();
    }
  }

  const main = () => {
    const context: Context = new Context();
    context.doOperation1();
    context.doOperation2();
  };

  main();
  // State1的状态需要处理的逻辑
  // 由状态state1转为state2
  // State2的状态需要处理的逻辑
  // 由状态state2转为state1
}

{
  /**
   * 策略模式
   */

  interface Strategy {
    // 策略模式运算法则
    doSomething: () => void;
  }

  class ConcreteStrategy1 implements Strategy {
    public doSomething(): void {
      console.log('使用的策略1');
    }
  }

  class ConcreteStrategy2 implements Strategy {
    public doSomething(): void {
      console.log('使用的策略2');
    }
  }

  class ContextOfStrategy {
    private _strategy: Strategy;
    constructor(strategy: Strategy) {
      this._strategy = strategy;
    }

    set strategy(strategy: Strategy) {
      this._strategy = strategy;
    }

    get strategy() {
      return this._strategy;
    }

    // 封装后的策略方法
    doOperation(): void {
      this._strategy.doSomething();
    }
  }

  const main = () => {
    const strategy1: Strategy = new ConcreteStrategy1();
    const strategy2: Strategy = new ConcreteStrategy2();
    const context: ContextOfStrategy = new ContextOfStrategy(strategy1);
    context.doOperation();
    context.strategy = strategy2;
    context.doOperation();
  };

  main();
  // 使用的策略1
  // 使用的策略2
}

{
  /**
   * 职责链模式
   */

  abstract class Handler {
    // 下一个处理者
    public successor?: Handler;

    public abstract handleRequest(request: MyRequest): void;

    public setNext(successor: Handler): void {
      this.successor = successor;
    }
  }

  class ConcreteHandler1 extends Handler {
    public handleRequest(request: MyRequest): void {
      // 首先判断当前级别是否能够处理，不能够处理则交给下一个级别处理
      if (request.level <= 1) {
        console.log('被一级处理');
      }
      else {
        // 交给下一级处理
        this.successor && this.successor.handleRequest(request);
      }
    }
  }

  class ConcreteHandler2 extends Handler {
    public handleRequest(request: MyRequest): void {
      // 首先判断当前级别是否能够处理，不能够处理则交给下一个级别处理
      if (request.level > 1 && request.level <= 2) {
        console.log('被二级处理');
      }
      else {
        // 交给下一级处理
        this.successor && this.successor.handleRequest(request);
      }
    }
  }

  class ConcreteHandler3 extends Handler {
    public handleRequest(request: MyRequest): void {
      // 首先判断当前级别是否能够处理，不能够处理则交给下一个级别处理
      if (request.level > 2) {
        console.log('被三级处理');
      }
      else {
        // 交给下一级处理
        this.successor && this.successor.handleRequest(request);
      }
    }
  }

  class MyRequest {
    private _level: number;
    constructor(level: number) {
      this._level = level;
    }

    get level(): number {
      return this._level;
    }

    set level(value: number) {
      this._level = value;
    }
  }

  const main = () => {
    // 创建一个请求
    const request: MyRequest = new MyRequest(5);

    // 创建相关处理人
    const handler1: Handler = new ConcreteHandler1();
    const handler2: Handler = new ConcreteHandler2();
    const handler3: Handler = new ConcreteHandler3();

    // 设置下级别审批，构成环形结构
    handler1.setNext(handler2);
    handler2.setNext(handler3);
    handler3.setNext(handler1);

    handler1.handleRequest(request);

    request.level = 1;
    handler1.handleRequest(request);
  };

  main();
  // 被三级处理
  // 被一级处理
}
