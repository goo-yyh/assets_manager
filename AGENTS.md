# AGENTS.md

本文件是给 AI 编程助手、协作开发者和自动化代码生成工具使用的项目规范。任何改动都应优先遵循本文件；如果本文件与项目中已有的 `package.json`、`tsconfig.json`、`vite.config.ts`、ESLint、Prettier、路由配置或业务代码风格冲突，以项目现有配置为准，并在改动说明中指出差异。

## 1. 项目技术栈

本后台管理系统固定采用以下前端技术栈：

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

默认项目形态为前后端分离的后台管理 SPA，不默认使用 SSR。除非需求明确要求，不要引入 Next.js、Vue、Redux、MobX、umi、dva、jQuery 或其他替代性框架。

## 2. Agent 工作原则

### 2.1 开始编码前必须先做的事

在修改代码前，先检查以下内容：

1. `package.json`：确认脚本命令、依赖版本、包管理器。
2. `src/routes` 或现有路由文件：确认路由组织方式。
3. `src/api`、`src/services` 或 `src/request`：确认接口封装方式。
4. `src/stores`：确认 Zustand store 写法。
5. `src/pages`：参考已有页面的目录、命名和组件拆分风格。
6. `tsconfig.json`：确认路径别名，例如是否支持 `@/`。

不要在没有检查现有实现的情况下新建一套并行架构。

### 2.2 修改范围原则

每次任务应保持改动范围尽量小：

- 优先在已有模块中补充代码，而不是重写模块。
- 不要无关地格式化大面积文件。
- 不要因为局部需求改动全局架构。
- 不要随意新增依赖；确需新增时，必须说明用途、替代方案和影响范围。
- 不要删除看似未使用但可能被动态路由、权限菜单、接口映射引用的代码，除非已经确认。

### 2.3 输出结果要求

完成任务后，应说明：

- 改了哪些文件。
- 实现了什么功能。
- 是否运行过 `lint`、`typecheck`、`build` 或测试。
- 是否存在未解决的问题或需要后端配合的地方。

## 3. 推荐目录结构

新建项目或新增模块时，优先遵循以下结构：

```txt
src/
  api/                  # Axios 实例、接口模块、请求/响应类型
    http.ts
    types.ts
    modules/
      user.ts
      auth.ts
      role.ts
  assets/               # 静态资源
  components/           # 全局通用组件
  config/               # 项目配置、菜单配置、权限配置
  constants/            # 常量、枚举映射
  hooks/                # 通用 hooks
  layouts/              # 后台布局、登录布局
  pages/                # 页面级组件
    Login/
    Dashboard/
    UserManagement/
  routes/               # 路由配置、路由守卫
  stores/               # Zustand 全局状态
  styles/               # 全局样式、主题变量
  types/                # 全局类型定义
  utils/                # 工具函数
  validators/           # Zod schema 或表单校验规则
  main.tsx
  App.tsx
```

目录命名建议：

- 页面目录：`PascalCase`，例如 `UserManagement`、`RoleManagement`。
- 普通工具目录：小写或 kebab-case，例如 `utils`、`query-keys`。
- 组件文件：`PascalCase.tsx`。
- hook 文件：`useXxx.ts`。
- store 文件：`xxxStore.ts`。
- API 文件：按业务模块命名，例如 `user.ts`、`auth.ts`。

## 4. TypeScript 规范

### 4.1 基本要求

- 必须优先使用 TypeScript 类型表达业务含义。
- 禁止滥用 `any`。确实无法确定类型时，优先使用 `unknown`，并在使用前做类型收窄。
- API 请求参数、响应数据、表单数据、表格行数据都必须有明确类型。
- 不要为了消除报错使用无意义的类型断言，例如 `as any`、`as unknown as Xxx`。
- 不要关闭 TypeScript 严格检查。

### 4.2 类型命名

推荐命名方式：

```ts
export type User = {
  id: string;
  username: string;
  status: UserStatus;
};

export type UserQueryParams = {
  keyword?: string;
  pageNum: number;
  pageSize: number;
};

export type UserListResponse = {
  list: User[];
  total: number;
};
```

约定：

- 实体类型：`User`、`Role`、`MenuItem`。
- 查询参数：`XxxQueryParams`。
- 创建参数：`CreateXxxPayload`。
- 更新参数：`UpdateXxxPayload`。
- 响应类型：`XxxResponse` 或 `XxxListResponse`。
- 枚举或联合类型：`XxxStatus`、`XxxType`。

## 5. React 编码规范

### 5.1 组件规范

- 页面组件放在 `src/pages`。
- 可复用业务组件放在对应页面的 `components` 子目录。
- 跨页面通用组件放在 `src/components`。
- 组件尽量保持单一职责。
- 页面文件不应堆积大量表格列、弹窗表单、请求逻辑和业务工具函数；复杂页面需要拆分。

推荐：

```txt
pages/UserManagement/
  index.tsx
  components/
    UserFormModal.tsx
    UserStatusTag.tsx
  hooks/
    useUserColumns.tsx
  types.ts
```

### 5.2 Hooks 规范

- 自定义 hook 必须以 `use` 开头。
- hook 只处理状态、请求、订阅、计算逻辑，不直接渲染复杂 UI。
- 不要在条件语句、循环或嵌套函数中调用 hook。
- 数据请求优先使用 TanStack Query，不要在页面中大量使用 `useEffect + useState` 手写请求状态。

### 5.3 状态管理边界

状态分三类处理：

1. **服务端状态**：接口数据、分页数据、详情数据，使用 TanStack Query。
2. **全局客户端状态**：用户信息、token、主题、侧边栏折叠状态，使用 Zustand。
3. **局部 UI 状态**：弹窗开关、当前选中行、临时输入状态，使用组件内 `useState`。

不要把接口列表数据长期放进 Zustand。不要用 TanStack Query 管理纯 UI 状态。

## 6. 路由规范：React Router

### 6.1 路由组织

路由建议集中配置，例如：

```ts
export type AppRoute = {
  path: string;
  element: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  permissions?: string[];
  children?: AppRoute[];
};
```

后台页面建议使用懒加载：

```ts
const UserManagement = lazy(() => import('@/pages/UserManagement'));
```

### 6.2 路由守卫

必须考虑以下场景：

- 未登录访问后台页面：跳转到登录页。
- 已登录访问登录页：跳转到默认首页。
- 无权限访问页面：展示 403 页面或跳转到可访问页面。
- 找不到路由：展示 404 页面。

前端权限只用于用户体验控制，不能替代后端权限校验。

### 6.3 菜单与路由

菜单应尽量从路由配置或统一配置中生成，避免菜单、路由、权限三套配置长期分离导致不同步。

## 7. UI 规范：Ant Design 与 ProComponents

### 7.1 组件选择原则

- 常规后台页面优先使用 Ant Design。
- 列表页、搜索表单、分页表格优先使用 ProComponents 的 `ProTable`。
- 复杂表单优先使用 `ProForm`、`ModalForm`、`DrawerForm`、`StepsForm`。
- 详情页可以使用 `ProDescriptions`。
- 数据录入和展示应尽量复用 Ant Design 的交互模式。

### 7.2 表格规范

表格页面必须考虑：

- 搜索条件。
- 分页。
- loading 状态。
- 空状态。
- 错误提示。
- 操作按钮权限。
- 批量操作确认。
- 删除操作二次确认。
- 时间、金额、状态字段格式化。

表格列建议独立到 hook 或配置文件中：

```ts
export const useUserColumns = (): ProColumns<User>[] => {
  return [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        enabled: { text: '启用', status: 'Success' },
        disabled: { text: '禁用', status: 'Default' },
      },
    },
  ];
};
```

### 7.3 表单规范

表单必须考虑：

- 新增和编辑是否复用。
- 初始值回填。
- 必填项。
- 字段长度。
- 前端格式校验。
- 后端错误回显。
- 提交中 loading。
- 提交成功后刷新列表。

表单校验优先做到类型和规则统一。复杂业务规则使用 Zod schema 表达，Ant Design Form 负责 UI 层展示。

### 7.4 样式规范

- 优先使用 Ant Design 组件和主题 token。
- 少写全局 CSS。
- 页面级样式建议使用 CSS Modules，例如 `index.module.css`。
- 不要直接覆盖大量 Ant Design 内部类名，确需覆盖时应限制作用域。
- 不要在多个页面复制粘贴同一段样式，应抽成组件或通用 class。

## 8. 请求规范：Axios

### 8.1 统一 Axios 实例

所有请求必须通过统一实例发出，不要在组件中直接调用 `axios.get` 或 `fetch`。

推荐结构：

```txt
api/
  http.ts
  types.ts
  modules/
    user.ts
```

示例：

```ts
// api/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  // 在这里统一处理 token、traceId、语言等请求头
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 在这里统一转换错误结构
    return Promise.reject(error);
  },
);
```

### 8.2 API 模块规范

```ts
// api/modules/user.ts
import { http } from '@/api/http';

export type UserQueryParams = {
  keyword?: string;
  pageNum: number;
  pageSize: number;
};

export type User = {
  id: string;
  username: string;
  status: 'enabled' | 'disabled';
};

export type UserListResponse = {
  list: User[];
  total: number;
};

export const userApi = {
  list(params: UserQueryParams) {
    return http.get<UserListResponse>('/users', { params });
  },
  detail(id: string) {
    return http.get<User>(`/users/${id}`);
  },
};
```

约定：

- API 方法名使用业务语义：`list`、`detail`、`create`、`update`、`remove`、`enable`、`disable`。
- 不要在页面组件里拼接复杂接口地址。
- 不要在页面组件里手写重复的错误转换逻辑。
- 后端响应结构如果统一包裹，例如 `{ code, message, data }`，应在 Axios 层统一处理。

## 9. 服务端状态：TanStack Query

### 9.1 使用边界

TanStack Query 用于：

- 列表查询。
- 详情查询。
- 新增、编辑、删除 mutation。
- 缓存、刷新、失效、重试。

不要用它保存侧边栏展开状态、主题、弹窗开关等纯 UI 状态。

### 9.2 Query Key 规范

每个业务模块应有稳定的 query key 工厂：

```ts
export const userQueryKeys = {
  all: ['users'] as const,
  list: (params: UserQueryParams) => [...userQueryKeys.all, 'list', params] as const,
  detail: (id: string) => [...userQueryKeys.all, 'detail', id] as const,
};
```

### 9.3 Mutation 后刷新

新增、编辑、删除成功后，应精准失效相关查询：

```ts
queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
```

不要通过刷新整个页面解决数据更新问题。

### 9.4 请求状态

页面必须明确处理：

- `isLoading` / `isPending`
- `isError`
- 空数据
- 提交中状态
- 重试或刷新入口

## 10. 全局状态：Zustand

### 10.1 Store 使用范围

Zustand 只用于必要的全局客户端状态，例如：

- 当前登录用户。
- token 或登录状态。
- 权限列表。
- 主题模式。
- 侧边栏折叠状态。
- 全局布局设置。

不要把所有页面状态都塞进全局 store。

### 10.2 Store 示例

```ts
import { create } from 'zustand';

export type AuthUser = {
  id: string;
  username: string;
  permissions: string[];
};

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
}));
```

### 10.3 持久化注意事项

- 如果使用 token，优先与后端确认是否可使用 HttpOnly Cookie。
- 如果必须使用 localStorage，需要注意 XSS 风险。
- 不要在 localStorage 中保存敏感个人信息、权限之外的隐私数据或明文密钥。

## 11. 数据校验：Zod

### 11.1 使用场景

Zod 推荐用于：

- 表单数据结构校验。
- 接口响应数据校验。
- 环境变量校验。
- 复杂业务规则校验。

不要只依赖 TypeScript 类型判断运行时数据。接口返回、用户输入、环境变量都属于运行时数据，需要在关键边界做校验。

### 11.2 表单 schema 示例

```ts
import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符').max(32, '用户名最多 32 个字符'),
  email: z.string().email('邮箱格式不正确'),
  status: z.enum(['enabled', 'disabled']),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
```

Ant Design Form 的 rules 可以复用 Zod 的业务规则，也可以在提交前统一调用 schema 校验。

## 12. 图表规范：ECharts

### 12.1 组件封装

ECharts 不应在多个页面重复初始化。建议封装通用图表组件，例如：

```txt
components/EChart/
  index.tsx
  types.ts
```

图表组件必须处理：

- 初始化。
- option 更新。
- 容器 resize。
- 组件卸载时 dispose。
- 空数据展示。
- loading 状态。

### 12.2 图表使用原则

- 后台看板应优先展示对业务有意义的指标，不要只堆图。
- 坐标轴、单位、tooltip、legend 必须清晰。
- 金额、百分比、日期等格式必须统一。
- 图表色彩应尽量使用主题变量或统一配置，不要在页面里随意硬编码大量颜色。

## 13. 权限与认证规范

### 13.1 登录态

必须处理：

- 登录成功保存登录态。
- 获取当前用户信息。
- token 过期或 401 时清理登录态。
- 退出登录。
- 页面刷新后恢复用户状态。

### 13.2 权限控制

权限控制分三层：

1. 路由权限：是否能访问页面。
2. 菜单权限：是否显示菜单入口。
3. 按钮权限：是否显示新增、编辑、删除、导出等操作。

前端权限仅用于展示和交互控制，后端接口必须再次校验权限。

### 13.3 权限工具函数

建议提供统一方法：

```ts
export const hasPermission = (permissions: string[], required?: string | string[]) => {
  if (!required) return true;
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.every((item) => permissions.includes(item));
};
```

不要在页面里到处写零散的权限判断字符串。

## 14. 错误处理规范

### 14.1 错误类型

必须区分：

- 网络错误。
- 401 未登录或登录过期。
- 403 无权限。
- 404 资源不存在。
- 422 / 400 参数错误。
- 500 服务端错误。
- 业务错误，例如余额不足、状态不允许操作。

### 14.2 用户提示

- 用户可理解的错误应使用 `message`、`notification` 或页面内 Alert 展示。
- 表单字段错误应尽量回显到具体字段。
- 不要直接展示后端堆栈、SQL 错误或内部错误码。
- 不要在同一次错误中重复弹出多个提示。

## 15. 环境变量规范

Vite 环境变量必须以 `VITE_` 开头。

推荐：

```txt
VITE_APP_NAME=后台管理系统
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MOCK=false
```

要求：

- 不要把密钥、私钥、数据库密码放进前端环境变量。
- 环境变量应提供 `.env.example`。
- 生产环境地址不要硬编码在业务代码里。
- 关键环境变量可以使用 Zod 在启动时校验。

## 16. Mock 与联调规范

如需 mock：

- 优先使用统一 mock 层，不要在页面里写假数据。
- mock 数据结构必须尽量贴近真实后端响应。
- mock 开关通过环境变量控制。
- 联调完成后，应删除无用 mock 或明确标记仅开发环境使用。

前后端联调时，接口字段以接口文档或 OpenAPI 为准。字段不一致时，不要在多个页面写临时兼容逻辑，应在 API 层统一转换。

## 17. 性能规范

- 路由页面使用 lazy loading。
- 大型弹窗、复杂图表、低频页面可以按需加载。
- 表格必须使用分页，不要一次性加载大量数据。
- 搜索输入应考虑 debounce。
- 不要在 render 中创建大量不稳定对象导致子组件重复渲染。
- `useMemo` 和 `useCallback` 只在有实际收益时使用，不要机械套用。
- ECharts 实例必须在组件卸载时销毁。

## 18. 可访问性与交互规范

- 表单项必须有清晰 label。
- 操作按钮文案必须明确，例如“删除用户”优于“确定”。
- 删除、禁用、重置密码等危险操作必须二次确认。
- loading 状态下应禁用重复提交。
- 空状态应给出下一步操作，例如“暂无数据，可点击新增创建”。
- 关键操作成功后应给出明确反馈。

## 19. 安全规范

- 不要使用 `dangerouslySetInnerHTML`，除非内容已经可信且经过严格处理。
- 不要在控制台打印 token、用户隐私、接口敏感参数。
- 不要把鉴权逻辑只放在前端。
- 不要把管理员权限、角色权限写死在前端作为唯一判断。
- 上传文件必须限制类型、大小，并由后端再次校验。
- 下载文件时应处理鉴权失败和错误响应。
- 对 URL 参数、表单输入、富文本内容保持不信任原则。

## 20. 代码风格规范

### 20.1 Import 顺序

建议顺序：

```ts
// 1. React / 第三方库
import { useMemo } from 'react';
import { Button } from 'antd';

// 2. 项目内部模块
import { userApi } from '@/api/modules/user';
import { useAuthStore } from '@/stores/authStore';

// 3. 相对路径
import { UserFormModal } from './components/UserFormModal';

// 4. 类型
import type { User } from '@/api/modules/user';

// 5. 样式
import styles from './index.module.css';
```

### 20.2 命名规范

- 变量和函数使用 `camelCase`。
- React 组件使用 `PascalCase`。
- 常量使用 `UPPER_SNAKE_CASE` 或语义化 `camelCase`，保持项目一致。
- 布尔值变量建议使用 `is`、`has`、`can`、`should` 开头。
- 事件函数建议使用 `handle` 开头，例如 `handleSubmit`。

### 20.3 注释规范

- 复杂业务规则必须写注释。
- 不要写无意义注释，例如“设置用户”。
- 临时代码必须标记 `TODO`，并说明原因。
- 不要保留大段被注释掉的旧代码。

## 21. 构建与质量检查

优先使用项目已有脚本。常见命令如下：

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

如果项目使用 npm 或 yarn，以 lockfile 为准：

- 存在 `pnpm-lock.yaml`：优先使用 pnpm。
- 存在 `package-lock.json`：优先使用 npm。
- 存在 `yarn.lock`：优先使用 yarn。

提交前尽量完成：

```bash
pnpm lint
pnpm typecheck
pnpm build
```

如果某个命令失败，不要忽略。应修复问题，或在结果说明中明确失败原因。

## 22. Git 与提交规范

推荐使用 Conventional Commits：

```txt
feat: 新增用户管理页面
fix: 修复登录过期跳转问题
refactor: 重构用户表格列配置
style: 调整页面样式
chore: 更新构建配置
docs: 更新项目文档
```

提交应聚焦单一目的，不要把格式化、重构、功能开发和 bug 修复混在一个提交里。

## 23. 后台常见页面实现要求

### 23.1 列表页

一个标准列表页至少包括：

- 搜索区域。
- 数据表格。
- 分页。
- 新增按钮。
- 行内编辑、删除或详情操作。
- 权限控制。
- loading、empty、error 状态。

优先使用 `ProTable`。

### 23.2 新增 / 编辑弹窗

- 新增和编辑可以复用一个 Form Modal。
- 编辑时必须处理数据回填。
- 提交成功后关闭弹窗并刷新列表。
- 提交失败时保留用户已输入内容。
- 提交中禁用按钮，避免重复提交。

### 23.3 详情页

- 详情页应处理 loading、error、empty。
- 字段展示应格式化日期、状态、金额等。
- 可编辑操作必须权限控制。

### 23.4 删除操作

- 必须二次确认。
- 删除成功后刷新列表。
- 如果删除的是当前页最后一条数据，应考虑分页回退。

## 24. 不允许的做法

除非有明确理由，否则不要这样做：

- 在组件里直接写 `axios.get(...)`。
- 用 `any` 逃避类型问题。
- 把接口数据大量存入 Zustand。
- 为了刷新数据调用 `window.location.reload()`。
- 在多个页面复制同一份表格列、状态字典、格式化函数。
- 把 API base URL 写死在代码里。
- 在前端保存明文密钥。
- 删除 ESLint 或 TypeScript 报错规则。
- 无说明地新增大型依赖。
- 使用过时的 class component 写新页面。
- 在页面中直接散落权限字符串。
- 把后端错误原样暴露给用户。

## 25. 新功能开发流程模板

当需要新增一个后台模块，例如“用户管理”，按以下顺序实现：

1. 新增 API 类型和接口方法：`src/api/modules/user.ts`。
2. 新增 query keys：`src/api/queryKeys/user.ts` 或模块内维护。
3. 新增页面：`src/pages/UserManagement/index.tsx`。
4. 拆分表单弹窗：`src/pages/UserManagement/components/UserFormModal.tsx`。
5. 拆分表格列：`src/pages/UserManagement/hooks/useUserColumns.tsx`。
6. 新增路由配置。
7. 新增菜单配置。
8. 接入权限点。
9. 接入 loading、empty、error 状态。
10. 运行 `lint`、`typecheck`、`build`。

## 26. 与后端接口约定

除非已有接口文档另有规定，前端默认期望后端分页接口接近以下结构：

```ts
export type PageParams = {
  pageNum: number;
  pageSize: number;
};

export type PageResponse<T> = {
  list: T[];
  total: number;
};
```

统一响应结构可以是：

```ts
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};
```

如果真实后端结构不同，应在 API 层做适配，避免页面层感知过多后端细节。

## 27. Agent 最终检查清单

提交或回复前检查：

- [ ] 是否遵循现有目录和命名风格。
- [ ] 是否没有引入不必要依赖。
- [ ] 是否没有使用不必要的 `any`。
- [ ] 是否统一通过 Axios 实例请求。
- [ ] 是否正确使用 TanStack Query 管理服务端状态。
- [ ] 是否没有滥用 Zustand。
- [ ] 是否处理 loading、error、empty 状态。
- [ ] 是否处理权限控制。
- [ ] 是否处理表单校验和重复提交。
- [ ] 是否处理删除等危险操作的二次确认。
- [ ] 是否运行或说明未运行 `lint`、`typecheck`、`build`。

## 28. 默认决策

当需求没有明确说明时，按以下默认值执行：

- 包管理器：优先跟随 lockfile；新项目优先 pnpm。
- 页面风格：Ant Design + ProComponents。
- 路由：React Router 配置式路由。
- 请求：Axios 统一实例。
- 服务端状态：TanStack Query。
- 全局客户端状态：Zustand。
- 表单校验：Ant Design Form + Zod。
- 图表：ECharts 封装组件后使用。
- 样式：CSS Modules + Ant Design token。
- 权限：路由、菜单、按钮三层控制。
- 构建：Vite SPA。

