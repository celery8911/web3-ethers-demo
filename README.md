# Web3 Ethers.js Demo

一个功能完整的 Web3 演示项目，展示如何使用 Ethers.js v6 与以太坊区块链交互，支持 MetaMask 钱包连接、网络切换、转账、文本/十六进制转换以及链上数据读取。

## ✨ 功能特性

### 1. 钱包连接 (WalletConnect)
- 🦊 连接 MetaMask 钱包
- 🔍 智能识别 MetaMask（支持多钱包环境）
- 💰 实时显示账户地址和余额
- 🌐 显示当前网络信息
- 🔌 断开钱包连接

### 2. 网络切换 (NetworkSwitch)
- 🔄 在 Sepolia 测试网和以太坊主网之间切换
- ✅ 网络切换确认提示
- 🎯 默认使用当前 MetaMask 连接的网络

### 3. 文本/十六进制转换器 (HexConverter)
- 📝 文本转十六进制
- 🔢 十六进制转文本
- 📋 一键复制转换结果
- 📊 显示字节数和字符数
- 🔄 双向实时转换

### 4. 转账功能 (Transfer)
- 💸 发送 ETH 到任意地址
- 🎯 快速填充零地址按钮
- 📦 支持交易数据字段（可粘贴十六进制备注）
- ✅ 地址格式验证
- 🔗 交易成功后显示 Etherscan 链接

### 5. 链上数据读取 (ChainDataReader)
- 📊 获取最新区块号
- 🧱 查看区块详细信息（哈希、时间戳、交易数、矿工地址）
- 🔍 根据交易哈希查询交易详情
- 💳 显示交易金额、发送方、接收方、区块号
- 📝 显示交易数据字段（如果有）

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ethers.js v6** - 以太坊交互库
- **Tailwind CSS v4** - 样式框架
- **Context API** - 全局状态管理

## 📦 安装和运行

### 前置要求

- Node.js >= 18
- 安装 MetaMask 浏览器扩展
- Sepolia 测试网 ETH（用于测试转账）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:5173` 运行

### 构建生产版本

```bash
npm run build
```

## 🌐 获取测试网 ETH

在 Sepolia 测试网测试转账功能前，需要获取一些测试 ETH：

**Sepolia 水龙头（Faucets）：**
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

## 📖 使用指南

### 连接钱包

1. 点击 "Connect Wallet" 按钮
2. 在 MetaMask 弹窗中批准连接请求
3. 连接成功后会显示账户地址、余额和网络信息

### 切换网络

1. 确保钱包已连接
2. 点击 "Switch to Sepolia" 或 "Switch to Mainnet"
3. 在 MetaMask 中确认网络切换

### 文本/十六进制转换

**文本转十六进制：**
1. 在左侧文本框输入文本（例如："Hello World"）
2. 自动生成十六进制输出
3. 点击 "Copy" 按钮复制结果

**十六进制转文本：**
1. 在右侧输入框输入十六进制（例如："0x48656c6c6f"）
2. 自动转换为文本
3. 点击 "Copy" 按钮复制结果

### 发送转账

1. 确保钱包已连接且在 Sepolia 测试网
2. 输入接收地址（或点击 "0x0...000" 快速填充零地址）
3. 输入转账金额（ETH）
4. （可选）粘贴从转换器生成的十六进制数据作为交易备注
5. 点击 "Send Transaction"
6. 在 MetaMask 中确认交易
7. 等待交易确认，完成后会显示 Etherscan 链接

### 读取链上数据

**获取区块信息：**
1. 点击 "Get Latest Block Number" 获取最新区块号
2. 点击 "Get Block Details" 查看区块详细信息

**查询交易：**
1. 在 Transaction Lookup 输入框粘贴交易哈希
2. 点击 "Get Transaction"
3. 查看交易详细信息

## 🏗️ 项目结构

```
ethers/
├── src/
│   ├── components/          # React 组件
│   │   ├── WalletConnect.tsx
│   │   ├── NetworkSwitch.tsx
│   │   ├── HexConverter.tsx
│   │   ├── Transfer.tsx
│   │   └── ChainDataReader.tsx
│   ├── contexts/           # Context API
│   │   └── WalletContext.tsx
│   ├── hooks/              # 自定义 Hooks
│   │   └── useWallet.ts
│   ├── utils/              # 工具函数
│   │   └── ethers.ts
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔑 核心实现

### MetaMask 多钱包环境支持

项目实现了智能的 MetaMask 检测逻辑，即使在安装了多个钱包扩展的环境下也能正确识别 MetaMask：

```typescript
export const getMetaMaskProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) return null;

  // 检查是否有多个钱包扩展
  if (window.ethereum.providers) {
    return window.ethereum.providers.find((p) => p.isMetaMask) || null;
  }

  // 单个钱包环境
  if (window.ethereum.isMetaMask) {
    return window.ethereum;
  }

  return null;
};
```

### 全局钱包状态管理

使用 Context API 实现全局钱包状态共享，确保所有组件都能访问到最新的钱包连接状态：

```typescript
// WalletContext.tsx
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
};

// 在组件中使用
const { isConnected, address, signer } = useWalletContext();
```

### 错误处理

项目实现了完善的错误处理机制：

- MetaMask 连接被拒绝（错误代码 4001）
- MetaMask 内部错误（错误代码 -32603）
- Circuit breaker 错误
- 网络切换失败
- 交易发送失败
- 数据查询失败

## 🌟 功能亮点

1. **独立的 Loading 状态** - 每个按钮都有独立的加载状态，互不干扰
2. **实时转换** - 文本和十六进制转换使用 `onKeyUp` 和 `onBlur` 事件，确保完整捕获所有输入
3. **地址验证** - 转账前自动验证以太坊地址格式
4. **交易数据支持** - 转账时可以附加十六进制数据作为备注
5. **用户友好的反馈** - 所有操作都有清晰的成功/错误提示
6. **Etherscan 集成** - 交易成功后提供直接跳转到区块浏览器的链接

## 🔒 安全注意事项

⚠️ **重要提醒：**

- 本项目仅用于学习和测试目的
- 在主网操作前请充分测试
- 不要在生产环境中硬编码私钥
- 转账到零地址的 ETH 将永久丢失
- 始终在测试网（Sepolia）进行测试

## 📝 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub: [celery8911/web3-ethers-demo](https://github.com/celery8911/web3-ethers-demo)
- Sepolia Etherscan: [https://sepolia.etherscan.io/](https://sepolia.etherscan.io/)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
