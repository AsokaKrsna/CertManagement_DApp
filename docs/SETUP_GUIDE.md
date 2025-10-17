# 🚀 Setup Guide - Transcript Verification DApp

## Prerequisites

Before you begin, make sure you have:

- ✅ Node.js (v14 or higher) installed
- ✅ MetaMask browser extension installed
- ✅ Some Sepolia testnet ETH (for deployment)

## Step-by-Step Setup

### 1️⃣ Install Dependencies

All dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

### 2️⃣ Get Infura API Key

1. Go to [https://infura.io/register](https://infura.io/register)
2. Sign up for a free account
3. Create a new project
4. Copy your **Project ID** (this is your API key)

### 3️⃣ Get Sepolia Testnet ETH

You need Sepolia ETH to deploy the contract:

1. Go to a Sepolia faucet:
   - [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
2. Connect your MetaMask wallet
3. Request test ETH (you'll need ~0.1 ETH for deployment)

### 4️⃣ Configure Environment Variables

1. Open the `.env` file in the project root
2. Add your MetaMask private key and Infura API key:

```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
INFURA_API_KEY=your_infura_project_id_here
```

**⚠️ SECURITY WARNING:**
- **NEVER** commit your `.env` file to git
- **NEVER** share your private key with anyone
- Use a **test wallet** for development, not your main wallet
- Your private key gives FULL ACCESS to your wallet - guard it carefully!

**How to get your private key from MetaMask:**
1. Open MetaMask
2. Click the 3 dots next to your account name
3. Click "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key (WITHOUT the 0x prefix)
7. Paste it in the `.env` file

### 5️⃣ Test Locally with Ganache

Before deploying to Sepolia, test locally:

1. **Option A: Install Ganache GUI**
   - Download from [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)
   - Start Ganache (it will run on port 7545 by default)

2. **Option B: Use Ganache CLI**
   ```bash
   npm install -g ganache
   ganache --port 7545
   ```

3. **Run Tests**
   ```bash
   npx truffle test
   ```

4. **Deploy to Local Network**
   ```bash
   npx truffle migrate --network development
   ```

### 6️⃣ Deploy to Sepolia Testnet

Once local testing is successful:

```bash
npx truffle migrate --network sepolia
```

**Expected Output:**
```
Compiling your contracts...
===========================
> Compiling .\contracts\TranscriptVerification.sol

Starting migrations...
======================
> Network name:    'sepolia'
> Network id:      11155111
> Block gas limit: 30000000

1_deploy_contracts.js
=====================

   Deploying 'TranscriptVerification'
   -----------------------------------
   > transaction hash:    0x...
   > contract address:    0x...
   > block number:        ...
   > account:             0x...
   > balance:             ...
   > gas used:            ...
   > gas price:           10 gwei
   > value sent:          0 ETH
   
   > Saving artifacts
   -------------------------------------
   > Total cost:          ... ETH
```

**🎉 Save the contract address - you'll need it for the frontend!**

### 7️⃣ Verify Contract on Etherscan (Optional)

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Search for your contract address
3. Click "Contract" tab → "Verify and Publish"
4. Fill in:
   - Compiler Version: v0.8.21
   - License: MIT
   - Paste your contract code from `contracts/TranscriptVerification.sol`
5. Submit verification

## 🧪 Running Tests

```bash
# Run all tests
npx truffle test

# Run specific test file
npx truffle test test/TranscriptVerification.test.js

# Run with verbose output
npx truffle test --show-events
```

## 📁 Project Structure

```
DApp2/
├── contracts/
│   └── TranscriptVerification.sol    # Smart contract
├── migrations/
│   └── 1_deploy_contracts.js         # Deployment script
├── test/
│   └── TranscriptVerification.test.js # Test suite
├── frontend/                          # (To be created)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── truffle-config.js                  # Truffle configuration
├── .env                               # Environment variables (DON'T COMMIT!)
├── .gitignore                         # Git ignore rules
└── package.json                       # NPM dependencies
```

## ⚙️ Truffle Commands

```bash
# Compile contracts
npx truffle compile

# Run migrations (deploy)
npx truffle migrate --network development
npx truffle migrate --network sepolia

# Run tests
npx truffle test

# Open Truffle console
npx truffle console --network development
npx truffle console --network sepolia

# Reset migrations (redeploy all)
npx truffle migrate --reset --network development
```

## 🔧 Troubleshooting

### Issue: "Error: Insufficient funds"
**Solution:** Make sure you have enough Sepolia ETH in your wallet. Get more from a faucet.

### Issue: "Error: Invalid mnemonic"
**Solution:** Check that your PRIVATE_KEY in `.env` is correct (without 0x prefix) and from a wallet with Sepolia ETH.

### Issue: "Error: Network connection timeout"
**Solution:** Check your Infura API key is correct and your internet connection is stable.

### Issue: Tests failing with Ganache
**Solution:** 
1. Make sure Ganache is running on port 7545
2. Try restarting Ganache
3. Check that no other process is using port 7545

### Issue: "Module not found" errors
**Solution:** Run `npm install` again to ensure all dependencies are installed.

## 📚 Next Steps

After successful deployment:

1. ✅ Create the frontend (HTML/CSS/JS)
2. ✅ Integrate ethers.js for Web3 interactions
3. ✅ Connect MetaMask to the frontend
4. ✅ Implement certificate issuance interface
5. ✅ Implement certificate verification interface
6. ✅ Test end-to-end functionality

## 🆘 Getting Help

If you encounter issues:

1. Check the [Truffle Documentation](https://trufflesuite.com/docs/)
2. Review the [Solidity Documentation](https://docs.soliditylang.org/)
3. Search for similar issues on [Stack Overflow](https://stackoverflow.com/questions/tagged/truffle)
4. Check [Ethereum StackExchange](https://ethereum.stackexchange.com/)

## 📝 Important Notes

- **Always test locally first** before deploying to Sepolia
- **Keep your seed phrase secure** - never share it or commit it
- **Use a test wallet** for development, not your main wallet
- **Save contract addresses** after deployment for frontend integration
- **Backup your code** regularly

---

**Ready to deploy? Follow the steps above and let's get your DApp live! 🚀**
