## 启动与在微信开发者工具中编译

### 环境准备
- Node.js（建议 LTS）
- 包管理器：Yarn 或 NPM（避免混用）
- 微信开发者工具（准备测试用 AppID）

### 克隆与安装
```bash
git clone <your-repo-url> lantuApp
cd lantuApp

# 二选一
yarn install
# 或
npm install
```

### 启动微信小程序开发构建
```bash
# 实时构建（监听变更）
npm run dev:weapp
# 或
yarn dev:weapp
```
- 构建输出目录：`dist/`（保持终端运行以便热更新）

### 在微信开发者工具导入项目
1. 打开微信开发者工具 → 导入项目。
2. 项目目录选择 `项目根目录下的 dist/`。
3. 填写小程序 `AppID`（无 AppID 可用测试号/无 AppID 调试）。
4. 选项建议：
   - 勾选“使用 npm 模块”（若存在）
   - 关闭“将 JS 编译为 ES5”（Taro 已处理）
   - 忽略上传 `node_modules`（默认即可）
5. 点击确定 → 预览/真机调试。

### 常见问题
- 包管理器混用警告：仅用一种（Yarn 或 NPM），删除另一种锁文件（`yarn.lock` 或 `package-lock.json`）后重装。
- Windows EPERM/权限问题（如 `esbuild.exe` 占用）：管理员运行、关闭占用进程（杀毒/索引/DevTools）、删除 `node_modules` 与锁文件后重装，必要时重启电脑。
- 类型定义误报（如 `sass`/`@ampproject`）：在 `tsconfig.json` 中仅保留
  ```json
  "typeRoots": ["node_modules/@types"]
  ```
  并按需设置 `"types"`（如 `"@tarojs/taro"`）。