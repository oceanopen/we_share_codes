# 大型项目前端架构浅谈

## 1. 前言

本篇文章不会侧重于具体技术实现，而是尝试从更高角度出发，分析为什么要这么做，这些设计能解决什么问题，成本和收益如何。

### 1.1 适用场景

> 本篇文章，适用于单个/多个大型项目、拥有超过 10 个以上的前端开发的场景。

前端项目的规模不同，成本收益比也会有所差别。
通常来说，人员越多、项目复杂度越高，那么收益/成本的比值越大。
对于人数较少、项目简单的开发团队，可能有部分措施不适用，因此应该根据具体情况来选用。

### 1.2 核心思想

- 解决问题：前端架构的设计，应是用于解决已存在或者未来可能发生的技术问题，增加项目的可管理性、稳定性、可扩展性。
- 人效比：对于需要额外开发工作量的事务（本文中存在一些需要一定开发量的内容），我们在决定是否去做的时候，应该考虑到两个要素：
  - 第一个是花费的人力成本；
  - 第二个是未来可能节约的时间和金钱、避免的项目风险与资损、提高对业务的支撑能力以带来在业务上可衡量的更高的价值、以及其他价值。
- 定性和定量：架构里设计的内容，一定要有是可衡量的意义的。
  - 最好是可以定量的 ———— 即可以衡量带来的收益或减少的成本；
  - 至少是可以定性的 ———— 即虽然无法用数字阐述收益，但我们可以明确这个是有意义的，例如增加安全性降低风险。
- 对数据敏感：专门写这一条强调数据作为依据的重要性。
  - 当我们需要说服其他部门/上级管理者，以推动我们设计的内容时，只有数据 ———— 特别是跟钱有关的数据，才是最有说服力的证明。
  - 若条件允许，建议架构设计者，可基于埋点系统获取的数据，对项目效果进行定量分析，并以此写成 PPT 和其他部门/上级管理者进行协调。

### 1.3 切入角度

分为基础层和应用层。
基础层偏基础设施建设，与业务相关性较低。
应用层更贴近用户，用于解决某一个问题。
部分两个都沾边的，根据经验划分到其中一个。

### 1.4 其他

由于已经谈到架构层级，因此很多内容，并不仅仅只属于前端领域，有很多内容是复合领域（前端、后端、运维、测试），因此需要负责架构的人，技术栈足够全面，对未来发展有足够的前瞻性。

> 以下章节的内容结构为：【项目描述】—>【解决的问题和带来的好处】—>【项目的实际意义】

## 2. 基础层设计

### 2.1 自建 Gitlab

这个是基础的基础了。
本不应该提的，不过考虑到有的公司并没有使用 `Gitlab`, 因此专门提一下，并且使用这个的难度非常低。
强烈建议使用 `Gitlab` 进行版本管理，自建 `Gitlab` 难度并不大，方便管理，包括代码管理、权限管理、提交日志查询，以及联动一些第三方插件。

**意义：**

公司代码是公司的重要资产，使用自建 `Gitlab` 可以有效保护公司资产。

### 2.2 版本管理

版本管理的几个关键点：

- 发布后分支锁死，不可再更改：指当例如 `0.0.1` 版本成功发布后，不可再更改 `0.0.1` 分支上的代码，否则可能会导致版本管理混乱。
- 全自动流程发布；指应避免开发者提交后，手动编译打包等操作，换句话说，开发人员发布后，将自动发布到预发布/生产环境。开发人员不和相关环境直接接触。
- 多版本并存；指当例如发布 `0.0.2` 版本后，`0.0.1` 版本的代码应仍保存在线上（例如 `CDN`），这样当出现线上 `bug` 时，方便快速回滚到上一个版本。

**意义：**

提高项目的可控性。

### 2.3、自动编译发布

基于 `gitflow` 等工具用于在代码发布后，执行一系列流程，例如自动编译打包合并，然后再从 `Gitlab` 发布到 `CDN` 或者静态资源服务器。
使用这个工具，可以让一般研发人员不关心代码传到 `Gitlab` 后会发生什么事情，只需要专心于开发就可以了。

**意义：**

让研发人员专心于研发，和环境、运维等事情脱钩。

### 2.4、纯前端版本发布

纯前端版本发布分为两步：

- 前端发布到生产环境 ———— 此时可以通过外网链接加正确的版本号访问到新版本的代码，但页面上的资源还是旧版本；
- 前端通过配置工具（或者是直接更新 `html` 文件），将 `html` 中引入的资源，改为新版本。

**解决的问题是：**

当前端需要发布新版本时，可以不依赖于后端（根据实际情况，也可以不依赖于运维）。
毕竟有很多需求并不需要后端介入，单纯改个前端版本后就要后端发布一次，显然是一件非常麻烦的事情。

**意义：**

提高发布效率，降低发布带来的人员时间损耗（这些都是钱），也可以在前端版本回滚的时候，速度更快。

### 2.5 统一脚手架

适用场景：有比较多独立中小项目。好处：

- 可以减少开发人员配置脚手架带来的时间损耗（特殊功能可以 `fork` 脚手架后再自行定制）；
- 统一项目结构，方便管理，也降低项目交接时带来的需要熟悉项目的时间；
- 方便统一技术栈，可以预先引入固定的组件库；

**意义：**

提高开发人员在多个项目之间的快速切换能力，提高项目可维护性，统一公司技术栈，避免因为环境不同导致奇怪的问题。

### 2.6 Node 中间层

> 此项可忽略，以实际项目需要为准。

适用场景：需要 `SEO` 或前端介入后端逻辑，直接读取后端服务或者数据库的情况。

- `SEO`: 需要搜索引擎引流的时候，还是有一定意义的（特别是需要搜索引擎引流的时候）；
- 前端读取后端服务/数据库：好处是提高前端的开发效率和对业务的支持能力，缺点是可能导致 P0 级故障。

**意义：**

让前端可以侵入后端领域，质的提升对业务的支持能力。

### 2.7 埋点系统

建议有条件的团队，前端做自己的埋点系统。这个不同于后端的日志系统。
前端埋点系统的好处：

- 记录每个页面的访问量（日周月年的 `UV`、`PV`）；
- 记录每个功能的使用量；
- 捕捉报错情况；
- 图表化显示，方便给其他部门展示；

埋点系统是前端高度介入业务，把握业务发展情况的一把利剑。
通过这个系统，我们可以比后端更深刻的把握用户的习惯，以及给产品经理、运营等人员提供准确的数据依据。
当有了数据后，前端人员就可以针对性的优化功能、布局、页面交互逻辑、用户使用流程。

埋点系统应和业务解耦，开发人员使用时注册，然后在项目中引入。
然后在埋点系统里查看相关数据（例如以小时、日、周、月、年为周期查看）。

### 2.8 监控和报警系统

监控和报警系统应基于埋点系统而建立，在如以下场景时触发：

- 当访问量有比较大的变化（比如日 `PV/UV` 只有之前 `20%` 以下）时，自动触发报警，发送邮件到相关人员邮箱；
- 比如报错量大幅度上升（比如 `200%` 或更高），则触发报警；
- 当一段时间内没有任何访问量（不符合之前的情况），则触发报警；
- 每过一段时间，自动汇总访问者/报错触发者的相关信息（例如系统、浏览器版本等）；

建设这个系统的好处在于，提前发现一些不容易发现的 `bug` (需要埋点做的比较扎实)。
有一些线上 `bug`, 因为用户环境特殊，导致无法被开发人员和测试人员发现。
但其中一部分 `bug` 又因为不涉及资金，并不会导致资损（因此也不会被后端的监控系统所发现），这样的 `bug` 非常容易影响项目里某个链路的正常使用。

**意义：**

提高项目的稳定性，提高对业务的把控能力。降低 `bug` 数，降低资损的可能性，提前发现某些功能的 `bug` (在工单到来之前)。

### 2.9 安全管理

前端的安全管理，通常要依赖于后端，至于只跟前端有关系的例如 `dom.innerHtml = 'xxx'` 这种太基础，就不提了。

安全管理的很难从架构设计上完全避免，但还是有一定解决方案的，常见安全问题如下：

- `XSS` 注入: 对用户输入的内容，需要转码（大部分时候要 `server` 端来处理，偶尔也需要前端处理），禁止使用 `eval` 函数；
- `https`: 这个显然是必须的，好处非常多；
- `CSRF`: 要求 `server` 端加入 `CSRF` 的处理方法（至少在关键页面加入）；

**意义：**

减少安全漏洞，避免用户受到损失，避免遭遇恶意攻击，增加系统的稳定性和安全性。

### 2.10 统一代码规范

> 常用的工具有 `Eslint` 和 `Prettier`, 一般两者结合使用。

好处很多：

- 降低低级 `bug` (例如拼写问题) 出现的概率；
- 增加代码的可维护性，可阅读性；
- 硬性统一代码风格，团队协作起来时更轻松；

总的来说, `Eslint` 推荐直接配置到脚手架之中，对我们提高代码的可维护性的帮助会很大。
可以考虑在上传到 `gitLab` 时，硬性要求代码规范校验，通过的才允许上传。

**意义：**

提高代码的可维护性，降低团队协作的成本。

### 2.11 灰度发布

灰度发布是大型项目在发布时的常见方法。
指在发布版本时，初始情况下，只允许小比例（比如 `1 ~ 5%` 比例的用户使用），若出现问题时，可以快速回滚使用老版本，适用于主链路和访问量极大的页面。

好处有以下几点：

- 生产环境比开发环境复杂，灰度发布时可以在生产环境小范围尝试观察新版本是否可以正常运行，即使出问题，也可以控制损失。
- 对于大版本更新，可以先灰度一部分，观察埋点效果和用户反馈（即所谓的抢先试用版）。假如效果并不好，那么回滚到老版本也可以及时止损；
- 当我们需要验证某些想法或问题的时候，可以先灰度一部分，快速验证效果如何，然后查漏补缺或者针对性优化；

灰度发布通常分为多个阶段：

- 【1】1 ~ 5%；
- 【2】30 ~ 50%；
- 【3】全量推送（100%）。

灰度发布一定要允许配置某些`账号`访问时，可以直接访问到灰度版本。

**意义：**

降低风险，提高发布灵活度。

### 2.12 前后端逻辑分离

这个并不是指常规的前后端分离，而是指分配前后端管控的领域。
中小项目常见的情况是有些逻辑既放在前端也放在后端。
但大型项目并不建议这么做，建议前端仅处理交互相关逻辑，其他数据处理交给后端，理由有很多：

- 页面交互和接口逻辑划分清晰，避免前端做复杂的数据处理，不便于迭代和维护；
- 接口以交互为基础进行设计，避免一个接口多种场景和用途调用。

**意义：**

降低页面和功能的耦合度，减少复杂页面的复杂度，也便于技术栈的升级。

### 2.13 Mock

`Mock` 也是常见前端系统之一，用于解决在后端接口未好时，生成返回的数据。

如果团队条件允许，可基于 `API` 平台进行自动生成 `mock` 数据并返回。
如果没有完善的 `API` 平台，那么不太建议开发一个专门的系统来 `Mock`, 更好的 `Mock` 手法是直接嵌入到接口配置中。
思路如下：

- 接口配置增加 `mock` 开关配置项和 `mock` 数据返回项；
- 封装好的异步请求在发现访问的接口配置 `mock` 开关打开时，不去读取线上的数据（因为也读取不到），而是直接返回 `mock` 数据返回项信息内容给用户；
- 异步请求正常拿到数据，在页面中显示；
- 当线上接口可以获取到数据后，从 `network` 里找到返回的数据，放入接口配置 `mock` 数据返回项中，此时再次本地调试的话，相当于使用的是线上的真实数据。
- 为了避免暴露接口数据到外网，打生产包的时候，把 `mock` 数据返回项信息置为空（可通过 `AST` 的方式清理）。

这种处理，可以降低 `mock` 的复杂度，随时更改 `mock` 时返回的数据，比单独开发一个 `mock` 系统性价比更高。

**意义：**

在前后端并行开发时，降低沟通交流成本，方便开发完毕后直接对接。

### 2.14 定期备份

备份是常被忽略的一件事情，但当我们遇见毁灭性场景时，缺少备份带来的损失是非常大的，常见场景：

- 服务器损坏，导致存在该服务器上的内容全部丢失；
- 触发某致命 `bug` 或者错误操作（例如 `rm -rf`），导致文件和数据全部消失；
- 数据库出现错误操作或出现问题，导致用户数据、公司资产遭受严重损失；

总的来说，没人想遇见这样的场景，但我们必须考虑这种极端情况的发生，因此需要从架构层面解决这个问题。
常见方法是定期备份、多机备份、容灾系统建设等。

**意义：**

避免在遭遇极端场景时，给公司带来不可估量的损失。

### 2.15 私有 npm 源

由于我们通常访问的是内网，因此，需要考虑内外网隔离的问题。因此，搭建私有 `npm` 源，提前从基础设计层面解决问题。
私有源常见有开源技术方案 `Verdaccio` 等。优势有以下几点：

- 轻量: `Verdaccio` 基于 `Node.js` 开发，占用资源少，运行速度快，配置简便，适合我们公司实际情况；
- 配置难度低：可以快速配置用户组、权限、运行端口、存放地址等，足以满足一般场景；
- 保证依赖版本稳定：相对于将依赖放到第三方远程源，放本地更稳定，一方面可以提高下载速度（因为部分第三方依赖连外网不稳定），另一方面，可以确保依赖始终存在（被缓存到本地私有 `npm` 源）；

**意义**

- 从架构层面上，解决了发布的线上代码不确定性问题，提高了前端代码的可靠性。
- 另外，我们会将一些自己封装的 `npm` 包发布到自己的 `npm` 源，提供给不同工程使用，避免重复开发带来的研发资源浪费。

## 3. 应用层设计

### 3.1 多页和单页

除了特殊场景，通常推荐使用多页架构。理由如下：

- 多页项目，页面和页面之间是独立的，不存在交互，因此当一个页面需要单独重构时，不会影响其他页面，对于有长期历史的项目来说，可维护性、可重构性要高很多；
- 多页项目的缺点是不同页面切换时，会有一个白屏时间，但通常来说，这个时间并不长，因此认为是可以接受的；
- 多页项目可以单次只更新一个页面的版本，而单页项目如果其中一个功能模块要更新（特别是公共组件更新），很容易让所有页面都需要更新版本；
- 多页项目的版本控制更简单，如果需要页面拆分，调整部分页面的使用流程，难度也会更低；
- 灰度发布更友好；

如果采用单页的形式，由于项目历史过的比较久，结果就会容易导致维护更新的难度很大，即使想部分重构，也很麻烦。

**意义：**

降低长期项目迭代维护的难度。

### 3.2 以应用为单位划分前端项目

在项目比较大的时候，将所有页面的前端文件放入到同一个代码仓库里，存在很多问题：

- 会极大的增加代码的维护难度；
- 项目会变得很丑陋；
- 不方便权限管理，容易造成页面误更改或代码泄密；
- 任何人都有权利改任何他能看到的页面（在合并代码的时候，管理人员并不能确定他本次修改的页面是否是需求里他应该改的页面）；
- 发布成本高，即使改一个页面，也需要发布所有资源；

因此，我们应该避免这种现象的发生，个人推荐以应用为单位进行开发、发布。
所谓应用即指一个业务涉及到的前后端代码，好处很多：

- 方便进行管理，当某个业务有需求变更时，可以只给研发人员该业务前端应用的 Developer 权限；
- 在需要发布某业务时，只需要发布该业务的所属应用即可；

**意义：**

规范项目，增加代码的安全性，降低项目维护成本。

### 3.3 基础组件库的建设

对于组件库的建设，不建议研发人员较少时去做这件事情，专职前端开发人数少于 `10` 人时，建议使用比较靠谱的第三方 `UI` 库，例如 `ElementUI`, 这样性价比更高。
设计基础组件库的前提，是要求统一技术栈，这样才能最大化基础组件库的效益。
组件库建议以使用以下参考标准：

- 使用 `ts`;
- 可扩展性强；
- 适用程度高；
- 文档清楚详细；
- 版本隔离，小版本优化加功能，大改需要大版本更新；
- 和 `UI` 协调统一，要求 `UI` 交互参与进来；

总的来说，建设起来后，利大于弊，但是需要专人维护，因此还是有一定成本的。

**意义：**

统一不同/相同产品线之间的风格，给用户更好的体验，减少单次开发中写 UI 组件时浪费的时间和人力，提高开发效率。

### 3.4 技术栈统一

前端有三大主流框架，还有兼容性最强 jQuery，以及各种第三方库，UI 框架。
因此项目需求如果复杂一些，很容易形成一个大杂烩。
因此前端的技术栈必须统一，具体来说，建议实现以下举措：

- 三大框架选型其一，具体以团队技术栈实际情况为准，一般为 Vue 或 React；
- 需要兼容 IE8 或更老版本时，建议使用 jQuery；
- 组件库自建或者统一选择一个固定的第三方；
- 一些特殊第三方库统一使用一个版本，例如需要使用地图时，固定使用高德或百度或腾讯地图；
- 基础设施建设应避免重复造轮子，所有团队尽量共用，并有专门的前端平台负责统一这些东西，对于特殊需求，可以新建，但应当有说服力；

总的来说，技术栈统一的好处很多，可以有效提高开发效率，降低重复造轮子产生的成本。

**意义：**

方便招人，简化团队成员培养成本，以及提高项目的可持续性。

### 3.5 浏览器兼容

常见的问题是 IE6、7、8，以及部分小众浏览器（PC 和手机）产生的奇怪问题。
因此应该考虑统一解决方案，避免 bug 的重复产生。
常见解决方案有：

- 配置 `postcss`, 让某些 `css` 增加兼容性前缀；
- 写一个 `wepback` 的 `loader`, 处理某些特殊场景；
- 规范团队代码，使用更稳定的写法（例如移动端避免使用 `fixed` 进行布局）；
- 对常见问题、疑难问题，总结解决方案并团队共享；
- 建议或引导用户使用高版本浏览器 (比如 `Chrome`)；

**意义：**

避免浏览器环境产生的 `bug`, 以及排查此类 `bug` 所浪费的大量时间。

### 3.6 内容平台建设

为了提高公司内部的沟通效率，总结经验，以及保密原因。应建设一个内部论坛+博客站点。其具备的好处如下：

- 可以记录公司的发展历史和文化宣传；
- 研发同学之间分享经验；
- 总结转载一些外界比较精品的文章，提高大家的眼界；
- 增加公司内部同学的交流，有利于公司的团队和文化建设；
- 对某些技术问题可以进行讨论，减少因没有达成共识带来的沟通损耗；

众所周知，大型互联网公司通常都有这样一个内部论坛和博客站点。
其降低了公司的沟通和交流成本，也增加了公司的技术积累。

**意义：**

博客增强技术积累，论坛增强公司内部沟通能力。

### 3.7 权限管理平台

当公司内部人员较多时，应有一个专门的平台，来管理、规范用户的权限以及可访问内容。
权限管理平台有几个特点：

- 必然和 `Server` 端天然高耦合度，因此需要有专门的控制模块负责处理权限问题（负责 `Server` 端开发处理，或者前端通过中间层例如 `Node` 层介入处理）；
- 自动化流程控制，即用户创建、申请、审批、离职自动删除，都应该是由系统推进并提醒相关人士，必要时应能触发报警；
- 权限应有时效性，减少永久性权限的产生；
- 审批流程应清晰可见，每一阶段流程应具体明确；
- 应与公司流程紧密结合，并且提高可修改性，方便公司后期进行流程优化；

**意义：**

使得公司内部流程正规化、信息化。

### 3.8 登录系统设计（单点登录）

当公司内部业务线比较复杂但相互之间的耦合度比较高时，我们应该考虑设计添加单点登录系统。
具体来说，用户在一处登录，即可以在任何页面访问，登出时，也同样在任何页面都失去登录状态。
`SSO` 的好处很多：

- 增强用户体验；
- 打通了不同业务系统之间的用户数据；
- 方便统一管理用户；
- 有利于引流；
- 降低开发系统的成本（不需要每个业务都开发一次登录系统和用户状态控制）；

总的来说，大中型 `web` 应用, `SSO` 可以带来很多好处，缺点却很少。

**意义：**

用户体验增强，打通不同业务之间的间隔，降低开发成本和用户管理成本。

### 3.9 CDN

前端资源的加载速度是衡量用户体验的重要指标之一。而现实中，因为种种因素，用户在加载页面资源时，会受到很多限制。
因此上 `CDN` 是非常有意义的，好处如下：

- 用户来自不同地区，加入 `CDN` 可以使用户访问资源时，访问离自己比较近的 `CDN` 服务器，降低访问延迟；
- 降低服务器带宽使用成本；
- 支持视频、静态资源、大文件、小文件、直播等多种业务场景；
- 消除跨运营商造成的网络速度较慢的问题；
- 降低 `DDoS` 攻击造成的对网站的影响（[什么是 DDoS 攻击？](https://www.zhihu.com/question/22259175)）；

`CDN` 是一种比较成熟的技术，各大云平台都有提供 `CDN` 服务，价格也不贵，因此 `CDN` 的性价比很高。

**意义：**

增加用户访问速度，降低网络延迟，带宽优化，减少服务器负载，增强对攻击的抵抗能力。

### 3.10 负载均衡

目前来看，负载均衡通常使用 `Nginx`. 当遇见大型项目的时候，负载均衡和分布式几乎是必须的。负载均衡有以下好处：

- 降低单台 `server` 的压力，提高业务承载能力；
- 方便应对峰值流量，扩容方便（如举办某些活动时）；
- 增强业务的可用性、扩展性、稳定性；

负载均衡已经是蛮常见的技术了，好处不用多说，很容易理解。

**意义：**

增强业务的可用性、扩展性、稳定性，可以支持更多用户的访问。

### 3.11 多端共用一套接口

目前常见场景是一个业务，同时有 PC 页面和 H5 页面，由于业务是一样的，因此应避免同一个业务有多套接口分别适用于 `PC` 和 `H5` 端。
因此解决方案如下：

- 后端提供的接口，应该同时包含 `PC` 和 `H5` 的数据（即单独对一个存在冗余数据）；
- 接口应当稳定，即当业务变更时，应尽量采取追加数据或者增加接口的形式；
- 只有在单独一端需要特殊业务流程时，设计单端独有接口；

多端共用接口，是减少开发工作量，并且提高业务可维护性的重要解决方案。

**意义：**

降低开发工作量，增强可维护性。

## 4. 更多

由于各个公司具体情况不同，项目也具有特殊性，因此以上设计不可强行套入，应根据自己公司规模、项目进展、人员数量等，优先考虑比较重要的功能和设计。
并需要考虑到长期项目的可维护性和发展需要，对部分基础设施进行提前研发设计。

篇幅所限，因此无法面面俱到，只提了一些个人认为比较重要的架构层面需要考虑的内容。

## 5. 参考

- [大型项目前端架构浅谈](https://juejin.cn/post/6844903853859536903)
