# 资产管理系统前端实施文档

> 依据：`specs/0002_demand_prove.md`  
> 目标：使用指定前端技术栈完成一个专业、美观、可交付的后台系统。  
> 客户行业：汽配行业。所有页面与 mock 数据均采用汽配制造集团场景。

## 1. 实施目标

本前端系统用于展示资产管理系统一期需求的完整业务闭环。系统不连接真实后端，所有数据通过本地 mock 文件提供，并通过 Axios 适配层本地接口请求。

系统必须覆盖以下业务模块：

- 固定资产台账管理
- 资产全生命周期管理
- 设备档案管理
- 集团多厂区管理
- 备品备件管理
- 维修保养数据展示
- 数据分析与可视化看板
- MOM 系统对接
- 财务系统对接
- 项目管理系统对接
- 角色权限管理

系统中所有模块必须有可见内容，不能出现空页面、空表格或占位式页面。

## 2. 技术栈

固定使用以下技术栈：

```txt
React
TypeScript
Vite
Ant Design
ProComponents
React Router
TanStack Query
Zustand
Axios
Zod
ECharts
```

技术分工：

- React + TypeScript：页面、组件、类型定义。
- Vite：项目构建与本地开发。
- Ant Design：基础 UI、表单、弹窗、布局、状态组件。
- ProComponents：ProLayout、ProTable、ProForm、ProDescriptions、ModalForm、DrawerForm。
- React Router：路由、菜单、页面权限守卫。
- TanStack Query：列表、详情、看板、本地接口数据请求状态。
- Zustand：登录用户、token、角色、菜单折叠、主题等客户端状态。
- Axios：统一请求实例，接入 mock adapter。
- Zod：表单与 mock 接口参数校验。
- ECharts：资产看板、厂区对比、维修分析、费用分析、备件分析图表。

## 3. 信息架构

### 3.1 菜单结构

```txt
登录
首页看板
资产管理
  固定资产台账
  资产入账
  资产调拨
  资产处置
  资产盘点
设备档案
  一机一档
  档案附件
备品备件
  备件台账
  库存管理
  入库管理
  领用出库
  备件盘点
  备件预警
维修保养
  MOM 数据展示
数据看板
  资产分析
  厂区对比
  维修分析
  费用分析
  备件分析
系统集成
  MOM 对接
  财务对接
  项目管理对接
权限管理
  组织架构
  用户管理
  角色权限
  操作日志
```

### 3.2 路由表

| 路由 | 页面 | 主要内容 | 权限标识 |
| --- | --- | --- | --- |
| `/login` | 登录页 | 角色选择、登录 | `public` |
| `/dashboard` | 首页看板 | 资产总览、预警、待办、趋势图 | `dashboard:view` |
| `/assets/list` | 固定资产台账 | 资产列表、查询、详情、导入 | `asset:view` |
| `/assets/intake` | 资产入账 | 转固入账列表、入账表单、财务编号关联 | `asset:intake` |
| `/assets/transfer` | 资产调拨 | 跨厂区调拨申请、审批状态、调拨详情 | `asset:transfer` |
| `/assets/disposal` | 资产处置 | 出售/报废申请、审批、核销状态 | `asset:disposal` |
| `/assets/inventory` | 资产盘点 | 盘点计划、扫码结果、差异处理 | `asset:inventory` |
| `/equipment/files` | 一机一档 | 设备档案列表、档案详情、附件、变更记录 | `equipment:view` |
| `/equipment/attachments` | 档案附件 | 合同、验收、证件、图片资料管理 | `equipment:attachment` |
| `/spares/catalog` | 备件台账 | 备件基础资料、适用设备、默认仓库 | `spare:view` |
| `/spares/stock` | 库存管理 | 厂区/仓库/库位库存、库存状态 | `spare:stock` |
| `/spares/inbound` | 入库管理 | 采购入库、退库入库、盘盈入库 | `spare:inbound` |
| `/spares/outbound` | 领用出库 | 维修领用、保养领用、调拨出库 | `spare:outbound` |
| `/spares/inventory` | 备件盘点 | 备件盘点计划、盘盈盘亏处理 | `spare:inventory` |
| `/spares/alerts` | 备件预警 | 低库存、超储、长期未动用预警 | `spare:alert` |
| `/maintenance/mom` | MOM 数据展示 | 运行状态、OEE、维修/保养记录、故障告警 | `mom:view` |
| `/analytics/assets` | 资产分析 | 总量、价值、状态、分类分析 | `analytics:asset` |
| `/analytics/factory` | 厂区对比 | 各厂区资产数量、价值、利用率 | `analytics:factory` |
| `/analytics/maintenance` | 维修分析 | 故障率、维修费用、停机趋势 | `analytics:maintenance` |
| `/analytics/finance` | 费用分析 | 原值、折旧、净值、处置费用 | `analytics:finance` |
| `/analytics/spares` | 备件分析 | 库存、消耗、预警、周转分析 | `analytics:spare` |
| `/integrations/mom` | MOM 对接 | 接口状态、同步记录、字段映射 | `integration:mom` |
| `/integrations/finance` | 财务对接 | 固定资产编号、价值同步、核销记录 | `integration:finance` |
| `/integrations/project` | 项目管理对接 | 项目验收接入、手工导入替代路径 | `integration:project` |
| `/system/orgs` | 组织架构 | 集团、厂区、车间、产线树 | `system:org` |
| `/system/users` | 用户管理 | 用户、角色、所属组织、状态 | `system:user` |
| `/system/roles` | 角色权限 | 角色定义、菜单权限、按钮权限、数据权限 | `system:role` |
| `/system/logs` | 操作日志 | 操作人、模块、动作、结果、时间 | `system:log` |
| `/403` | 无权限页 | 权限不足提示 | `public` |
| `*` | 404 页 | 路由不存在提示 | `public` |

## 4. 目录结构

按以下结构组织代码：

```txt
src/
  api/
    http.ts
    mockAdapter.ts
    types.ts
    modules/
      asset.ts
      equipment.ts
      spare.ts
      maintenance.ts
      analytics.ts
      integration.ts
      system.ts
  mock/
    index.ts
    factories.ts
    assets.ts
    equipmentFiles.ts
    spares.ts
    maintenance.ts
    analytics.ts
    integrations.ts
    users.ts
    logs.ts
  components/
    AppPageContainer.tsx
    PermissionButton.tsx
    StatusTag.tsx
    MoneyText.tsx
    FactoryBreadcrumb.tsx
    ChartCard.tsx
  config/
    routes.tsx
    permissions.ts
    menu.ts
  constants/
    asset.ts
    spare.ts
    workflow.ts
  hooks/
    usePermission.ts
    useTableRequest.ts
    useECharts.ts
  layouts/
    BasicLayout.tsx
    LoginLayout.tsx
  pages/
    Login/
    Dashboard/
    Assets/
      AssetList/
      AssetIntake/
      AssetTransfer/
      AssetDisposal/
      AssetInventory/
    Equipment/
      EquipmentFiles/
      Attachments/
    Spares/
      SpareCatalog/
      SpareStock/
      SpareInbound/
      SpareOutbound/
      SpareInventory/
      SpareAlerts/
    Maintenance/
      MomData/
    Analytics/
      AssetAnalytics/
      FactoryAnalytics/
      MaintenanceAnalytics/
      FinanceAnalytics/
      SpareAnalytics/
    Integrations/
      MomIntegration/
      FinanceIntegration/
      ProjectIntegration/
    System/
      Orgs/
      Users/
      Roles/
      Logs/
    Exception/
      Forbidden.tsx
      NotFound.tsx
  routes/
    AppRouter.tsx
    guards.tsx
  stores/
    authStore.ts
    layoutStore.ts
  styles/
    global.less
    theme.ts
  types/
    asset.ts
    equipment.ts
    spare.ts
    maintenance.ts
    analytics.ts
    integration.ts
    system.ts
  validators/
    asset.ts
    spare.ts
    workflow.ts
  utils/
    format.ts
    permission.ts
    queryKeys.ts
  App.tsx
  main.tsx
```

## 5. UI 设计要求

### 5.1 整体风格

系统面向汽配制造集团，界面应体现“专业、清晰、稳定、可运营”：

- 主色：工业蓝 `#1677ff`。
- 辅色：状态绿、预警橙、故障红、金属灰。
- 页面密度：后台管理风格，信息密度适中，不做营销式大面积留白。
- 卡片半径：控制在 6-8px。
- 表格：列信息完整，金额、状态、时间、组织层级格式统一。
- 图表：使用 ECharts，图表必须有真实业务含义和数据。

### 5.2 首页看板

首页必须展示：

- 资产总数、资产总原值、累计折旧、净值、在线设备数、低库存备件数。
- 待办事项：调拨审批、处置审批、备件领用审批、盘点差异处理。
- 资产状态分布：在用、闲置、维修中、调拨中、已报废。
- 厂区资产价值对比：宁波压铸工厂、苏州冲压工厂、重庆总装配套厂、安徽新能源零部件工厂。
- 近 6 个月维修费用趋势。
- 备件低库存预警列表。

### 5.3 列表页规范

所有列表页使用 `ProTable`，必须具备：

- 搜索表单。
- 分页。
- loading 状态。
- 空状态。
- 状态 Tag。
- 操作列。
- 权限控制按钮。
- 新增、编辑、查看、审批等交互。

新增、编辑、审批类弹窗使用 `ModalForm` 或 `DrawerForm`。详情展示使用 `ProDescriptions`。

## 6. Mock 数据设计

### 6.1 Mock 数据原则

- 所有页面必须有 mock 数据。
- mock 数据集中放在 `src/mock`。
- 数据行业场景必须是汽配制造。
- 数据应覆盖正常、异常、预警、审批中、已完成等多种状态。
- mock 接口返回结构统一为：

```ts
export type ApiResponse<T> = {
  code: 0;
  message: 'success';
  data: T;
};

export type PageResult<T> = {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
};
```

### 6.2 汽配行业示例数据

组织与厂区：

- 震裕科技集团
- 宁波压铸工厂
- 苏州冲压工厂
- 重庆总装配套厂
- 安徽新能源零部件工厂

车间与产线：

- 铝合金压铸车间
- 冲压成型车间
- CNC 精加工车间
- 焊接总成车间
- 电池托盘产线
- 电机壳体产线
- 底盘结构件产线

固定资产示例：

- `AST-NB-DC-0001`：2800T 铝合金压铸机
- `AST-SZ-ST-0008`：高速冲压生产线
- `AST-AH-BT-0012`：电池托盘激光焊接工作站
- `AST-CQ-AS-0021`：底盘结构件机器人焊接线
- `AST-NB-CNC-0033`：五轴 CNC 加工中心
- `AST-SZ-QC-0042`：三坐标检测仪

备品备件示例：

- `SP-BRG-6208`：高速轴承 6208
- `SP-HYD-VLV-02`：液压比例阀
- `SP-SRV-MTR-15KW`：15kW 伺服电机
- `SP-LSR-LENS-1064`：激光保护镜片
- `SP-PNE-CYL-80`：气缸 80mm
- `SP-FLT-HYD-10U`：液压滤芯 10μm

人员示例：

- 张敏：资产管理员，宁波压铸工厂
- 李强：设备档案管理员，苏州冲压工厂
- 王磊：备件管理员，安徽新能源零部件工厂
- 陈工：维修/保养人员，重庆总装配套厂
- 赵芳：财务人员，集团财务中心
- 刘总：管理层，集团总部

## 7. 类型模型

### 7.1 固定资产类型

```ts
export type AssetStatus =
  | 'in_use'
  | 'idle'
  | 'maintenance'
  | 'transferring'
  | 'disposed';

export type Asset = {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  model: string;
  manufacturer: string;
  factoryId: string;
  workshopId: string;
  lineId: string;
  location: string;
  status: AssetStatus;
  originalValue: number;
  accumulatedDepreciation: number;
  netValue: number;
  financeAssetCode: string;
  purchaseDate: string;
  ownerDepartment: string;
  responsiblePerson: string;
};
```

### 7.2 设备档案类型

```ts
export type EquipmentFile = {
  id: string;
  assetId: string;
  assetCode: string;
  equipmentName: string;
  technicalParams: Record<string, string>;
  acceptanceDocs: Attachment[];
  contractDocs: Attachment[];
  certificates: Attachment[];
  images: Attachment[];
  changeRecords: EquipmentChangeRecord[];
};
```

### 7.3 备品备件类型

```ts
export type SpareStatus = 'normal' | 'low_stock' | 'over_stock' | 'inactive';

export type SparePart = {
  id: string;
  spareCode: string;
  name: string;
  category: string;
  spec: string;
  unit: string;
  brand: string;
  factoryId: string;
  warehouseId: string;
  locationCode: string;
  stockQty: number;
  safetyStock: number;
  minStock: number;
  status: SpareStatus;
  applicableAssetCodes: string[];
};
```

### 7.4 工作流类型

```ts
export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';

export type WorkflowRecord = {
  id: string;
  bizType: 'asset_transfer' | 'asset_disposal' | 'spare_outbound' | 'spare_inventory';
  bizCode: string;
  title: string;
  applicant: string;
  factoryId: string;
  status: ApprovalStatus;
  currentApprover?: string;
  createdAt: string;
};
```

## 8. 页面实施明细

### 8.1 固定资产台账页面

路由：`/assets/list`

页面内容：

- 顶部统计：资产总数、在用资产、维修中资产、已报废资产、资产净值。
- 搜索项：资产编码、资产名称、资产分类、厂区、状态、财务编号。
- 表格列：资产编码、名称、型号、分类、厂区、车间、产线、状态、原值、净值、责任人、财务编号、操作。
- 操作：详情、编辑、查看档案、发起调拨、发起处置。

覆盖需求：。

### 8.2 资产入账页面

路由：`/assets/intake`

页面内容：

- 转固来源：财务系统、项目管理系统、手工录入、Excel 导入。
- 表格列：转固单号、资产名称、来源系统、验收项目、财务编号、入账状态、创建时间、操作。
- 操作：查看、确认入账、补充档案、导入。

覆盖需求：、。

### 8.3 资产调拨页面

路由：`/assets/transfer`

页面内容：

- 调拨列表：调拨单号、资产、调出厂区、调入厂区、申请人、审批人、状态、申请时间。
- 调拨申请弹窗：资产选择、调入组织、调拨原因、附件。
- 调拨详情抽屉：审批时间线、资产归属变更、财务同步状态。

覆盖需求：、、、、。

### 8.4 资产处置页面

路由：`/assets/disposal`

页面内容：

- 处置列表：处置单号、资产、处置类型、原因、评估金额、审批状态、财务核销状态。
- 处置申请弹窗：出售/报废、原因、评估信息、附件。
- 详情抽屉：审批记录、资产状态变更、财务核销记录。

覆盖需求：、、。

### 8.5 资产盘点页面

路由：`/assets/inventory`

页面内容：

- 盘点计划：计划名称、厂区、范围、应盘数量、已盘数量、差异数量、状态。
- 盘点结果：资产编码、账面位置、实际位置、盘点结果、差异原因。
- 操作：新建计划、扫码、差异处理。

覆盖需求：。

### 8.6 设备档案页面

路由：`/equipment/files`

页面内容：

- 档案列表：资产编码、设备名称、型号、厂家、厂区、档案完整度、最近变更时间。
- 详情页或抽屉分 Tabs：基本信息、技术参数、验收资料、合同证件、图片影像、变更记录、维保数据。
- 操作：查看、编辑、上传附件、查看关联资产。

覆盖需求：。

### 8.7 备品备件台账页面

路由：`/spares/catalog`

页面内容：

- 备件列表：备件编码、名称、分类、规格、单位、品牌、适用设备、默认仓库、库存状态。
- 操作：新增备件、编辑、详情、查看库存、查看适用设备。

覆盖需求：、、。

### 8.8 备件库存页面

路由：`/spares/stock`

页面内容：

- 库存总览：库存 SKU 数、低库存数、超储数、长期未动用数。
- 表格列：备件编码、名称、厂区、仓库、库位、当前库存、安全库存、最低库存、库存状态。
- 操作：查看流水、调整库存、发起盘点。

覆盖需求：、、。

### 8.9 备件入库页面

路由：`/spares/inbound`

页面内容：

- 入库单列表：单号、入库类型、备件、数量、厂区、仓库、来源单据、经办人、状态、时间。
- 入库类型：采购入库、退库入库、盘盈入库。
- 操作：新增入库、详情、审核。

覆盖需求：。

### 8.10 备件领用出库页面

路由：`/spares/outbound`

页面内容：

- 出库单列表：单号、出库类型、备件、数量、关联设备、用途、领用人、审批状态。
- 出库类型：维修领用、保养领用、调拨出库、盘亏出库。
- 操作：发起领用、审批、发放、未用退库。

覆盖需求：、、。

### 8.11 备件盘点页面

路由：`/spares/inventory`

页面内容：

- 备件盘点计划、盘点结果、盘盈盘亏处理。
- 展示厂区、仓库、库位维度的账实差异。

覆盖需求：。

### 8.12 备件预警页面

路由：`/spares/alerts`

页面内容：

- 低库存预警、超储预警、长期未动用预警。
- 支持按厂区、仓库、分类、预警类型筛选。
- 操作：查看备件、生成补货建议、查看消耗趋势。

覆盖需求：、。

### 8.13 MOM 数据展示页面

路由：`/maintenance/mom`

页面内容：

- 设备运行状态卡片：运行、停机、故障。
- OEE 趋势图。
- 维修记录列表。
- 保养记录列表。
- 故障告警列表。
- 明确标识“数据来自 MOM，本系统仅展示与关联，不处理维修保养业务操作”。

覆盖需求：。

### 8.14 数据看板页面

路由：

- `/analytics/assets`
- `/analytics/factory`
- `/analytics/maintenance`
- `/analytics/finance`
- `/analytics/spares`

页面内容：

- 资产分析：资产总数、总价值、分类统计、状态分布。
- 厂区对比：厂区资产数量、价值、利用率。
- 维修分析：故障率趋势、维修费用、停机次数。
- 费用分析：原值、折旧、净值、处置核销金额。
- 备件分析：库存金额、消耗金额、低库存预警、长期未动用备件。

覆盖需求：。

### 8.15 系统集成页面

路由：

- `/integrations/mom`
- `/integrations/finance`
- `/integrations/project`

页面内容：

- MOM 对接：接口状态、同步时间、同步数据量、字段映射、失败记录。
- 财务对接：财务编号关联、转固同步、价值变动同步、处置核销记录。
- 项目管理对接：验收项目列表、入账触发记录、手工导入替代路径。

覆盖需求：。

### 8.16 角色权限页面

路由：

- `/system/orgs`
- `/system/users`
- `/system/roles`
- `/system/logs`

页面内容：

- 组织架构：集团、厂区、车间、产线树。
- 用户管理：用户、角色、组织、状态。
- 角色权限：菜单权限、按钮权限、数据权限。
- 操作日志：操作人、模块、动作、结果、时间、IP。

覆盖需求：角色定义、权限矩阵、数据权限规则、审批权限规则。

## 9. 权限实施方案

### 9.1 前端权限模型

```ts
export type PermissionCode =
  | 'asset:view'
  | 'asset:intake'
  | 'asset:transfer'
  | 'asset:disposal'
  | 'asset:inventory'
  | 'equipment:view'
  | 'spare:view'
  | 'spare:stock'
  | 'spare:inbound'
  | 'spare:outbound'
  | 'spare:inventory'
  | 'spare:alert'
  | 'mom:view'
  | 'analytics:asset'
  | 'analytics:factory'
  | 'analytics:maintenance'
  | 'analytics:finance'
  | 'analytics:spare'
  | 'integration:mom'
  | 'integration:finance'
  | 'integration:project'
  | 'system:org'
  | 'system:user'
  | 'system:role'
  | 'system:log';
```

### 9.2 系统角色

登录页提供角色快速切换：

- 管理层：看板与汇总数据为主。
- 资产管理员：资产台账、生命周期、盘点、调拨、处置。
- 设备档案管理员：设备档案与附件维护。
- 备件管理员：备件台账、库存、入库、出库、盘点、预警。
- 财务人员：财务编号、价值、折旧、核销数据。
- 厂区负责人：本厂区业务申请与审批。
- 维修/保养人员：维保数据查看、备件领用/退库。
- 系统管理员：组织、用户、角色、权限、日志。

### 9.3 权限交互

- 菜单按角色权限过滤。
- 无权限路由跳转 `/403`。
- 操作按钮使用 `PermissionButton` 控制显示。
- 表格数据按用户所属厂区过滤，管理层和系统管理员可查看全集团数据。

## 10. 数据请求与 Mock 接口

### 10.1 请求封装

`src/api/http.ts` 创建 Axios 实例：

- baseURL 使用 `/api`。
- 请求拦截器注入 mock token。
- 响应拦截器统一处理 `ApiResponse<T>`。
- 失败时使用 Ant Design `message.error` 展示。

### 10.2 TanStack Query

每个模块建立独立 query key：

```ts
export const queryKeys = {
  assets: ['assets'],
  assetDetail: (id: string) => ['assets', id],
  spares: ['spares'],
  spareStock: ['spares', 'stock'],
  equipmentFiles: ['equipmentFiles'],
  momData: ['momData'],
  analytics: ['analytics'],
};
```

列表页使用 `useQuery` 请求 mock 数据。新增、编辑、审批使用 `useMutation`，成功后更新本地缓存或重新 invalidate query。

### 10.3 Mock Adapter

`src/api/mockAdapter.ts` 根据 URL 和 method 返回 `src/mock` 中的数据：

- `GET /api/assets`
- `GET /api/assets/:id`
- `POST /api/assets/intake`
- `POST /api/assets/transfer`
- `POST /api/assets/disposal`
- `GET /api/equipment-files`
- `GET /api/spares`
- `GET /api/spares/stock`
- `POST /api/spares/inbound`
- `POST /api/spares/outbound`
- `GET /api/mom/devices`
- `GET /api/analytics/assets`
- `GET /api/integrations/mom/sync-records`
- `GET /api/system/users`
- `GET /api/system/roles`

## 11. 表单校验

使用 Zod 定义表单 schema：

- 资产入账：资产名称、资产编码、厂区、分类、原值、财务编号必填。
- 资产调拨：资产、调入厂区、调拨原因必填。
- 资产处置：资产、处置类型、处置原因、评估金额必填。
- 备件台账：备件编码、名称、分类、规格、单位、默认仓库必填。
- 备件入库：备件、数量、仓库、入库类型必填，数量必须大于 0。
- 备件出库：备件、数量、用途、关联设备或领用人必填，数量必须大于 0。
- 用户管理：姓名、账号、角色、组织、状态必填。

## 12. 功能覆盖矩阵

| 功能范围 | 页面/模块 |
| --- | --- |
| 固定资产台账 | 固定资产台账、资产入账、资产盘点 |
| 资产生命周期 | 资产入账、资产调拨、资产处置、资产详情 |
| 设备档案 | 一机一档、档案附件、资产详情 |
| 多厂区管理 | 组织架构、多厂区查询、资产调拨、数据权限 |
| 备品备件 | 备件台账、库存管理、入库、出库、盘点、预警 |
| 维修保养 | MOM 数据展示 |
| 数据分析 | 数据看板、资产分析、厂区对比、维修分析、费用分析、备件分析 |
| 系统集成 | MOM 对接、财务对接、项目管理对接、资产入账 |
| 角色权限 | 登录页、路由守卫、角色权限、用户管理、组织架构、操作日志 |

## 13. 实施顺序

1. 初始化 Vite + React + TypeScript 项目，安装指定依赖。
2. 配置 Ant Design、ProComponents、全局主题、基础布局。
3. 建立路由、菜单、权限守卫和 Zustand 登录状态。
4. 建立 mock 数据、Axios mock adapter、TanStack Query 请求封装。
5. 实现首页看板和 ECharts 基础组件。
6. 实现固定资产台账、资产入账、调拨、处置、盘点。
7. 实现设备档案和附件页面。
8. 实现备品备件台账、库存、入库、出库、盘点、预警。
9. 实现 MOM 数据展示、数据分析看板。
10. 实现 MOM、财务、项目管理系统集成页面。
11. 实现组织、用户、角色权限、操作日志。
12. 完成所有页面 mock 数据填充、权限按钮控制和视觉统一。
13. 运行 `lint`、`typecheck`、`build`，修复问题。

## 14. 系统验收标准

### 14.1 页面完整性

- 菜单中每个模块都有对应页面。
- 每个页面都有真实业务内容和汽配行业 mock 数据。
- 主要列表页均有搜索、分页、状态、操作。
- 主要表单均有 Zod 校验。
- 看板图表均有 ECharts 展示。

### 14.2 功能覆盖

- `specs/0002_demand_prove.md` 中所有功能需求均有对应页面或交互。
- 备品备件管理作为一期模块完整呈现。
- 角色权限矩阵可通过登录角色切换和按钮权限体现。

### 14.3 视觉质量

- 后台布局清晰，导航结构稳定。
- 页面信息密度适合管理系统，不做空泛展示。
- 状态、金额、日期、厂区、资产编码、备件编码格式统一。
- 汽配行业数据真实可信，避免通用占位数据。

### 14.4 前端系统可运行

- `npm run dev` 可启动本地服务。
- `npm run build` 可完成构建。
- 不依赖真实后端服务。
- mock 数据和本地接口可以支撑全部页面展示。
