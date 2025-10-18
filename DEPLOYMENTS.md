# 📦 Deployment Records

## Holesky Testnet - BodhiBasedCopyright

### 🎯 Main Contract: BodhiBasedCopyright
- **Address:** [`0x73da0D133EF544B5107271A36eB30c69f84adcac`](https://holesky.etherscan.io/address/0x73da0D133EF544B5107271A36eB30c69f84adcac#code)
- **Network:** Holesky Testnet
- **Chain ID:** 17000
- **Verified:** ✅ Sourcify
- **Verification URL:** https://repo.sourcify.dev/17000/0x73da0D133EF544B5107271A36eB30c69f84adcac/
- **Deployed At:** 2025-10-17 21:10 UTC+8
- **Contract:** `BodhiBasedCopyright.sol`
- **Solidity Version:** 0.8.18
- **Optimizer:** Enabled (200 runs)

### 📋 License Contract (Modular)
- **Address:** [`0xc4872863fAFA8116E02004AE2Ea4a375808da312`](https://holesky.etherscan.io/address/0xc4872863fAFA8116E02004AE2Ea4a375808da312#code)
- **Network:** Holesky Testnet
- **Chain ID:** 17000
- **Verified:** ✅ Manual (via flattened source)
- **Deployed At:** 2025-10-17
- **Contract:** `License.sol`
- **Solidity Version:** 0.8.20
- **Optimizer:** Enabled (200 runs)
- **Notes:** Fixed `struct License` → `struct LicenseTemplate` naming conflict

---

## 🧪 Development Environment (Localhost)

### Local Hardhat Network (Chain ID: 31337)
- **Registry:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **LicenseCenter:** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Bodhi1155:** `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

---

## 📝 Verification Notes

### BodhiBasedCopyright
- ✅ Successfully verified on **Sourcify** (automatic)
- Full source code and metadata available
- ABI extracted and integrated into frontend

### License Contract
- ✅ Successfully verified using **manual flattened source**
- Resolved naming conflict: `struct License` → `struct LicenseTemplate`
- Flattened source includes OpenZeppelin dependencies (Ownable, Context)
- Verification file: `packages/hardhat/flat/License_final.sol`

---

## 🔗 Useful Links

### Holesky Testnet
- **Faucet:** https://holesky-faucet.pk910.de/
- **Explorer:** https://holesky.etherscan.io/
- **RPC:** https://ethereum-holesky-rpc.publicnode.com
- **Chain ID:** 17000

### Contract Explorers
- **BodhiBasedCopyright (Etherscan):** https://holesky.etherscan.io/address/0x73da0D133EF544B5107271A36eB30c69f84adcac#code
- **BodhiBasedCopyright (Sourcify):** https://repo.sourcify.dev/17000/0x73da0D133EF544B5107271A36eB30c69f84adcac/
- **License (Etherscan):** https://holesky.etherscan.io/address/0xc4872863fAFA8116E02004AE2Ea4a375808da312#code

---

## 🚀 Deployment Commands

### Deploy to Holesky
```bash
# Navigate to hardhat directory
cd packages/hardhat

# Deploy License contract
npx hardhat run scripts/deploy-license.ts --network holesky

# Verify contract (if not auto-verified)
npx hardhat verify --network holesky <CONTRACT_ADDRESS>
```

### Deploy to Localhost
```bash
# Terminal 1: Start Hardhat node
cd packages/hardhat
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/01_deploy_bodhi_system.ts --network localhost
```

---

## 🛠️ Environment Variables Required

```env
PRIVATE_KEY=<your_private_key_without_0x_prefix>
RPC_URL=https://ethereum-holesky-rpc.publicnode.com
ETHERSCAN_API_KEY=<your_etherscan_api_key>
```

---

**Last Updated:** October 17, 2025, 21:30 UTC+8
