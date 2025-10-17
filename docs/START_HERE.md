# 🎓 START HERE - Academic Project Quick Guide

## Welcome! 👋

This is the **simplified academic version** of the Transcript Verification DApp. Perfect for learning and demonstration!

---

## 🎯 What We're Building (Simple Version)

### The Idea
A website where:
1. **Registrars** (institutions) can issue certificates
2. Certificates are stored on blockchain (tamper-proof)
3. **Anyone** can verify if a certificate is real

### How It Works
```
1. Upload certificate to Google Drive
2. Get shareable link
3. On website: Upload file → Calculate hash
4. Store hash + link on blockchain
5. To verify: Upload file → Check hash on blockchain
```

### Tech Stack (Simple)
- **Smart Contract**: Solidity (stores hashes)
- **Frontend**: HTML + CSS + JavaScript (no frameworks!)
- **Storage**: Google Drive (for certificate files)
- **Blockchain**: Sepolia testnet (free test ETH)
- **Wallet**: MetaMask

---

## 🚀 Quick Setup (30 minutes)

### Step 1: Install Required Software (10 min)

```powershell
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org/ (v18 or v20)
node --version  # Check if installed

# 2. Install Truffle globally
npm install -g truffle

# 3. Install Ganache (optional - for local testing)
npm install -g ganache-cli

# 4. Install MetaMask extension in browser
# Chrome: https://metamask.io/download/
```

### Step 2: Setup Project (5 min)

```powershell
# Navigate to project folder
cd c:\Users\Durjoy\Downloads\DApp2

# Install dependencies
npm init -y
npm install @openzeppelin/contracts dotenv @truffle/hdwallet-provider

# Initialize Truffle
truffle init
```

### Step 3: Get API Keys (10 min)

1. **Infura** (for Sepolia access)
   - Go to: https://infura.io
   - Sign up → Create new project
   - Copy API key

2. **MetaMask** (wallet)
   - Install extension
   - Create new wallet
   - **IMPORTANT**: Save seed phrase safely!
   - Copy private key (Settings → Security & Privacy → Show private key)

3. **Sepolia Test ETH**
   - Go to: https://sepoliafaucet.com/
   - Paste your MetaMask address
   - Get free test ETH

### Step 4: Configure Environment (5 min)

Create `.env` file:
```env
INFURA_API_KEY=your_infura_key_here
SEPOLIA_PRIVATE_KEY=your_private_key_without_0x
```

**⚠️ IMPORTANT**: Never share your private key or commit `.env` to Git!

---

## 📁 Project Structure (What to Create)

```
DApp2/
├── contracts/
│   └── TranscriptVerification.sol    ← Smart contract
├── migrations/
│   └── 1_deploy_contracts.js         ← Deployment script
├── test/
│   └── TranscriptVerification.test.js ← Tests
├── frontend/
│   ├── index.html                    ← Home page
│   ├── issue.html                    ← Issue certificate
│   ├── verify.html                   ← Verify certificate
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js                    ← Main logic
│       ├── contract.js               ← Contract info
│       └── utils.js                  ← Hash calculation
├── truffle-config.js                 ← Truffle config
├── .env                              ← Secrets (don't commit!)
└── package.json
```

---

## 💻 Development Workflow

### Day 1-2: Smart Contract

1. **Create contract** (`contracts/TranscriptVerification.sol`)
   - See code in [`docs/ACADEMIC_SIMPLIFIED.md`](ACADEMIC_SIMPLIFIED.md)

2. **Write tests** (`test/TranscriptVerification.test.js`)
   ```javascript
   const TranscriptVerification = artifacts.require("TranscriptVerification");
   
   contract("TranscriptVerification", accounts => {
       it("should issue certificate", async () => {
           const instance = await TranscriptVerification.deployed();
           const hash = web3.utils.keccak256("test");
           await instance.issueCertificate(hash, accounts[1], "http://drive.com/cert");
           const [valid, cert] = await instance.verifyCertificate(hash);
           assert.equal(valid, true);
       });
   });
   ```

3. **Test locally**
   ```powershell
   # Terminal 1: Start Ganache
   ganache-cli
   
   # Terminal 2: Run tests
   truffle test
   ```

### Day 3: Deploy to Sepolia

1. **Configure Truffle** (`truffle-config.js`)
   ```javascript
   require('dotenv').config();
   const HDWalletProvider = require('@truffle/hdwallet-provider');
   
   module.exports = {
       networks: {
           sepolia: {
               provider: () => new HDWalletProvider(
                   process.env.SEPOLIA_PRIVATE_KEY,
                   `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
               ),
               network_id: 11155111,
               gas: 5500000,
               gasPrice: 10000000000
           }
       },
       compilers: {
           solc: {
               version: "0.8.0"
           }
       }
   };
   ```

2. **Deploy**
   ```powershell
   truffle migrate --network sepolia
   ```

3. **Save contract address** (shown in output)

### Day 4-6: Frontend

1. **Create HTML pages**
   - Copy structure from [`docs/ACADEMIC_SIMPLIFIED.md`](ACADEMIC_SIMPLIFIED.md)
   - Use Bootstrap for quick styling

2. **Add JavaScript logic**
   - MetaMask connection
   - File hash calculation
   - Contract interaction

3. **Update contract address** in `frontend/js/contract.js`

4. **Test locally**
   - Open `frontend/index.html` in browser
   - Or use Live Server extension in VS Code

### Day 7-8: Testing & Polish

1. Test all flows end-to-end
2. Fix bugs
3. Improve UI
4. Add error handling
5. Prepare demo

---

## 🎬 How to Demo (5 minutes)

### Preparation
1. ✅ Contract deployed on Sepolia
2. ✅ Sample certificate in Google Drive (make public)
3. ✅ Frontend open in browser
4. ✅ MetaMask connected to Sepolia

### Demo Script
```
👋 "This is a blockchain-based certificate verification system"

1. Issue Certificate:
   - "I'm a registrar at XYZ University"
   - Connect MetaMask
   - Upload certificate PDF
   - Enter student address: 0x123...
   - Enter Drive link
   - Click Issue → Transaction sent
   - "Hash is stored on blockchain: 0xabc..."

2. Verify Certificate:
   - "Now anyone can verify this certificate"
   - Go to verify page
   - Upload same certificate
   - Click Verify → Shows VALID ✅
   - Display certificate details

3. Show Blockchain:
   - Open Sepolia Etherscan
   - Show transaction
   - "This is permanent and tamper-proof"

4. Try Invalid Certificate:
   - Upload different file
   - Verify → NOT FOUND ❌
   - "Only real certificates validate"

✨ "That's blockchain certificate verification!"
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "MetaMask not detected"
```javascript
// Check if MetaMask is installed
if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask!');
}
```

### Issue 2: "Wrong network"
```javascript
// Check network ID
const network = await provider.getNetwork();
if (network.chainId !== 11155111n) {
    alert('Please switch to Sepolia!');
}
```

### Issue 3: "Insufficient funds"
- Go to Sepolia faucet: https://sepoliafaucet.com/
- Get free test ETH

### Issue 4: "Transaction failed"
- Check gas limit (increase if needed)
- Verify you're connected as registrar
- Check contract is not paused

### Issue 5: "Can't calculate hash"
```javascript
// Make sure file is loaded
if (!file) {
    alert('Please select a file first');
    return;
}
```

---

## 📚 Learning Resources

### Tutorials
- **Solidity**: https://docs.soliditylang.org/
- **Truffle**: https://trufflesuite.com/tutorial/
- **ethers.js**: https://docs.ethers.org/v6/
- **MetaMask**: https://docs.metamask.io/

### Videos
- "Blockchain Basics" on YouTube
- "Solidity Tutorial for Beginners"
- "Building Your First DApp"

### Communities
- Ethereum Stack Exchange
- Reddit: r/ethdev
- Discord: Truffle Suite

---

## ✅ Completion Checklist

### Smart Contract
- [ ] Contract written and compiled
- [ ] Basic tests written and passing
- [ ] Deployed to Ganache (local)
- [ ] Deployed to Sepolia
- [ ] Contract verified on Etherscan

### Frontend
- [ ] HTML pages created
- [ ] MetaMask connection works
- [ ] Can calculate file hash
- [ ] Can issue certificate
- [ ] Can verify certificate
- [ ] Error handling added

### Documentation
- [ ] Code commented
- [ ] README updated with contract address
- [ ] Screenshots taken
- [ ] Demo video recorded (optional)

### Presentation
- [ ] Demo script prepared
- [ ] Slides created
- [ ] Test run completed
- [ ] Backup plan ready

---

## 🎯 Grading Criteria (Typical)

Most academic projects are graded on:

1. **Functionality** (40%)
   - Does it work?
   - All features implemented?

2. **Code Quality** (20%)
   - Clean code?
   - Commented?
   - Best practices?

3. **Documentation** (20%)
   - Clear README?
   - Setup instructions?
   - Code comments?

4. **Presentation** (20%)
   - Clear explanation?
   - Good demo?
   - Questions answered?

**Focus on getting it working first, then polish!**

---

## 💡 Pro Tips

1. **Start Simple**: Get basic issue/verify working before adding features
2. **Test Often**: Don't wait until the end
3. **Commit Regularly**: Save your work (but not .env!)
4. **Ask for Help**: StackOverflow, Discord, professors
5. **Document as You Go**: Don't leave it for last day
6. **Backup Everything**: GitHub, Google Drive, USB
7. **Practice Demo**: At least 3 times before presentation

---

## 🆘 Need Help?

### During Development
1. Check documentation files
2. Search error messages on Google
3. Ask on StackOverflow (tag: solidity, truffle)
4. Ethereum Discord servers

### For Academic Help
1. Office hours with professor/TA
2. Study group with classmates
3. University tech support

---

## 🎉 You're Ready!

You have everything you need:
- ✅ Clear documentation
- ✅ Simple approach
- ✅ Code examples
- ✅ Step-by-step guide
- ✅ Troubleshooting tips

### Your Next 3 Actions:

1. **Right Now**: 
   - Install Node.js and Truffle
   - Setup MetaMask
   - Get Sepolia test ETH

2. **Today**:
   - Create smart contract
   - Write basic tests
   - Test on Ganache

3. **This Week**:
   - Deploy to Sepolia
   - Build frontend
   - Test everything

---

## 📞 Quick Links

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **Infura**: https://infura.io/
- **MetaMask**: https://metamask.io/
- **Truffle Docs**: https://trufflesuite.com/docs/

---

**Remember**: This is a learning project. It doesn't need to be perfect. Focus on:
1. Understanding how it works
2. Getting a working demo
3. Being able to explain it

**You've got this! 💪 Good luck! 🚀**

---

**Questions?** Re-read the docs or search online. Most issues have been solved by others!

**Stuck?** Take a break, come back fresh. Sometimes that's all you need!

**Excited?** You should be! You're building on blockchain! 🎉
