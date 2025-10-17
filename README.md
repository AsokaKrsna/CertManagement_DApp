# Transcript Verification DApp - Academic Project (Simplified)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.0-green.svg)
![Network](https://img.shields.io/badge/Network-Sepolia-orange.svg)

---

## 🎯 Project Overview (Simplified for Academic Use)

A **simple and functional** decentralized application for issuing and verifying tamper-proof digital certificates on the Ethereum blockchain.

### Academic Project Goals
- ✅ Understand blockchain and smart contracts
- ✅ Learn Web3 integration
- ✅ Build a working DApp with practical use case
- ✅ Keep it simple and functional

---

## 📋 Simplified Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (HTML + CSS + JavaScript)     │
│                                          │
│  - Issue Certificate Form                │
│  - Verify Certificate Page               │
│  - Admin Panel                           │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │  MetaMask   │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼────┐  ┌─▼──┐
│Smart  │  │ Google │  │RPC │
│Contract│  │ Drive  │  │Node│
└───────┘  └────────┘  └────┘
 Sepolia    Storage    Infura
```

---

## 🎨 Simplified Approach

### Storage Strategy

**Option A: Google Drive (Simplest)**
1. Upload certificate PDF/image to Google Drive
2. Get shareable link
3. Calculate hash of certificate file
4. Store hash + Drive link on blockchain
5. For verification: Fetch from Drive, calculate hash, compare

**Option B: Direct File Upload (Alternative)**
1. User uploads certificate file
2. Calculate hash in browser (using Web Crypto API)
3. Store hash on blockchain
4. For verification: Upload file, calculate hash, verify on-chain

**Option C: Hybrid (Flexible)**
1. Certificate stored on Google Drive
2. Hash stored on blockchain
3. Verification accepts:
   - Direct file upload (calculate hash)
   - Certificate hash (direct check)
   - Google Drive link (fetch & verify)

### Recommended: **Option C (Hybrid)** - Most flexible for academic demo

---

## 🛠️ Simplified Tech Stack

### Smart Contract
- **Solidity** ^0.8.0
- **Truffle** for development
- **Ganache** for local testing
- **Sepolia** testnet for deployment

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (vanilla or Bootstrap for quick UI)
- **JavaScript** (ES6+) - Logic
- **ethers.js** - Web3 library (simpler than web3.js)
- **MetaMask** - Wallet connection

### Storage
- **Google Drive** - Certificate files (PDFs, images)
- **Blockchain** - Certificate hashes + metadata

### Tools
- **Web Crypto API** - Hash calculation in browser
- **Google Drive API** (optional) - Fetch files
- **Infura** - Sepolia RPC endpoint

---

## 📁 Simplified Project Structure

```
DApp2/
├── contracts/
│   └── TranscriptVerification.sol    # Smart contract
├── migrations/
│   └── 1_deploy_contracts.js         # Deployment script
├── test/
│   └── TranscriptVerification.test.js # Tests
├── frontend/
│   ├── index.html                    # Home page
│   ├── issue.html                    # Issue certificate page
│   ├── verify.html                   # Verify certificate page
│   ├── admin.html                    # Admin panel
│   ├── css/
│   │   └── style.css                 # Styling
│   └── js/
│       ├── app.js                    # Main app logic
│       ├── contract.js               # Contract interactions
│       └── utils.js                  # Helper functions
├── docs/                             # Documentation
├── .env                              # Environment variables
├── .env.example
├── truffle-config.js
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Install Node.js (v18+)
# Install Truffle
npm install -g truffle

# Install Ganache (optional)
npm install -g ganache-cli
```

### 2. Setup
```bash
# Clone/navigate to project
cd DApp2

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Infura API key and private key to .env
```

### 3. Development
```bash
# Start local blockchain
ganache-cli

# Compile contracts
truffle compile

# Run tests
truffle test

# Deploy locally
truffle migrate --network development

# Open frontend
# Just open frontend/index.html in browser (with Live Server)
```

### 4. Deploy to Sepolia
```bash
# Deploy to Sepolia
truffle migrate --network sepolia

# Update contract address in frontend/js/contract.js

# Open frontend and test
```

---

## 📝 Simplified Smart Contract

### Core Data Structure
```solidity
struct Certificate {
    bytes32 certificateHash;      // Hash of certificate file
    address issuer;               // Who issued it
    address student;              // Student address
    string driveLink;             // Google Drive link (optional)
    uint256 issueTimestamp;       // When issued
    bool revoked;                 // Revocation status
}
```

### Main Functions
```solidity
// Admin adds registrar
function addRegistrar(address _registrar) public onlyAdmin

// Issue certificate
function issueCertificate(
    bytes32 _certHash,
    address _student,
    string memory _driveLink
) public onlyRegistrar

// Verify certificate
function verifyCertificate(bytes32 _certHash) 
    public view returns (bool valid, Certificate memory cert)

// Revoke certificate
function revokeCertificate(bytes32 _certHash) public onlyRegistrar
```

---

## 🎨 Frontend Flow

### Issue Certificate (Registrar)
1. Login with MetaMask
2. Fill form:
   - Student address
   - Upload certificate file (PDF/image)
   - Add Google Drive link (optional)
3. JavaScript calculates file hash
4. Submit transaction to blockchain
5. Show certificate hash to user

### Verify Certificate (Public)
**Option 1: Upload File**
- Upload certificate file
- Calculate hash in browser
- Check hash on blockchain
- Show result (Valid/Invalid/Revoked)

**Option 2: Enter Hash**
- Paste certificate hash
- Check on blockchain
- Show result

**Option 3: Google Drive Link**
- Paste Drive link
- Fetch file (if public)
- Calculate hash
- Verify on blockchain

---

## 💻 Frontend Code Snippets

### Calculate File Hash (JavaScript)
```javascript
async function calculateFileHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return '0x' + hashHex;
}
```

### Connect MetaMask
```javascript
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return { provider, signer, account: accounts[0] };
    } else {
        alert('Please install MetaMask!');
    }
}
```

### Issue Certificate
```javascript
async function issueCertificate(certHash, studentAddr, driveLink) {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    
    const tx = await contract.issueCertificate(certHash, studentAddr, driveLink);
    await tx.wait();
    
    alert('Certificate issued! Hash: ' + certHash);
}
```

### Verify Certificate
```javascript
async function verifyCertificate(certHash) {
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    const [valid, cert] = await contract.verifyCertificate(certHash);
    
    if (!valid) {
        alert('Certificate not found!');
    } else if (cert.revoked) {
        alert('Certificate is REVOKED!');
    } else {
        alert('Certificate is VALID!');
        // Display certificate details
    }
}
```

---

## 🔐 Simple Security Measures

### Smart Contract
- ✅ Access control (only registrars can issue)
- ✅ Certificate hash immutability
- ✅ Revocation mechanism
- ✅ Event logging

### Frontend
- ✅ Input validation
- ✅ Network check (must be Sepolia)
- ✅ Clear error messages
- ✅ Transaction confirmation

**Note**: Keep it simple - focus on core functionality!

---

## 📊 Google Drive Integration

### Option 1: Manual (Simplest)
1. Upload certificate to Google Drive
2. Make it publicly accessible (or shareable link)
3. Copy link
4. Paste link when issuing certificate
5. For verification: Fetch from link, verify hash

### Option 2: Google Drive API (Advanced - Optional)
```javascript
// If you want to integrate Google Drive API
// Need: Google Cloud project + Drive API enabled
// For academic project, manual approach is fine!
```

**Recommendation**: Use manual approach (Option 1) for simplicity

---

## 🎯 Minimal Viable Features

### Must Have (Core)
- [x] Smart contract with basic functions
- [x] Issue certificate (store hash on-chain)
- [x] Verify certificate (check hash)
- [x] Simple HTML frontend
- [x] MetaMask connection
- [x] File hash calculation

### Nice to Have (If Time Permits)
- [ ] Revocation functionality
- [ ] Admin panel
- [ ] Better UI/styling
- [ ] Google Drive integration
- [ ] Certificate details display

### Skip for Now
- ❌ Complex IPFS integration
- ❌ Database layer
- ❌ NFT certificates
- ❌ Email notifications
- ❌ Advanced analytics

---

## 📝 Simplified Development Timeline

### Week 1: Foundation (Days 1-3)
- Day 1: Setup environment, understand concepts
- Day 2: Write basic smart contract
- Day 3: Write tests, deploy to Ganache

### Week 2: Frontend (Days 4-6)
- Day 4: HTML structure + CSS styling
- Day 5: JavaScript logic + Web3 integration
- Day 6: Connect frontend to contract

### Week 3: Integration & Testing (Days 7-9)
- Day 7: Test all flows end-to-end
- Day 8: Deploy to Sepolia, fix issues
- Day 9: Polish UI, add error handling

### Week 4: Final Touches (Days 10-12)
- Day 10: Documentation + demo prep
- Day 11: Final testing
- Day 12: Presentation ready!

**Total**: 12 days (flexible, can do faster!)

---

## ✅ Quick Checklist

### Smart Contract
- [ ] Basic structure (structs, mappings)
- [ ] Access control (admin, registrar)
- [ ] Issue certificate function
- [ ] Verify certificate function
- [ ] Events
- [ ] Tests
- [ ] Deploy to Sepolia

### Frontend
- [ ] HTML pages (issue, verify)
- [ ] CSS styling (Bootstrap or custom)
- [ ] MetaMask connection
- [ ] File hash calculation
- [ ] Issue certificate flow
- [ ] Verify certificate flow
- [ ] Error handling

### Documentation
- [ ] README with setup instructions
- [ ] Code comments
- [ ] Demo video/screenshots
- [ ] Presentation slides

---

## 🎓 Learning Objectives (Academic)

After completing this project, you will:
- ✅ Understand blockchain and smart contracts
- ✅ Write and deploy Solidity contracts
- ✅ Use Truffle for development
- ✅ Integrate Web3 with vanilla JavaScript
- ✅ Use MetaMask for authentication
- ✅ Calculate cryptographic hashes
- ✅ Build a complete DApp from scratch

---

## 💡 Pro Tips for Academic Project

1. **Keep it Simple**: Focus on core functionality
2. **Document as You Go**: Comment your code
3. **Test Everything**: Use Ganache first
4. **Start with Basics**: Get one feature working before adding more
5. **Use Bootstrap**: Quick professional UI
6. **Google is Your Friend**: Search for solutions
7. **Ask for Help**: Community is helpful
8. **Demo Ready**: Make sure it works for presentation!

---

## 🎬 Demo Scenario

### Setup
1. Open Ganache/Connect to Sepolia
2. Open frontend in browser
3. Connect MetaMask

### Demo Flow
1. **Admin**: Add registrar address
2. **Registrar**: 
   - Upload certificate PDF
   - Enter student address
   - Issue certificate (get hash)
3. **Verifier**:
   - Upload same certificate
   - Verify (should show VALID)
   - Upload different file
   - Verify (should show INVALID)

**Total Demo Time**: 5-10 minutes

---

## 📚 Reference Documentation

For detailed information, see:
- [Security Analysis](docs/security_analysis.md) - Comprehensive security guide
- [Solution Approach](docs/solution_approach.md) - Detailed architecture
- [Design Decisions](docs/design_decisions.md) - Technical choices
- [Quick Reference](docs/quick_reference.md) - Handy commands

**Note**: These are detailed references. For academic project, focus on core functionality!

---

## 🔗 Useful Resources

- **Solidity**: https://docs.soliditylang.org/
- **Truffle**: https://trufflesuite.com/docs/
- **ethers.js**: https://docs.ethers.org/
- **MetaMask**: https://docs.metamask.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Web Crypto API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

---

## 🎉 Success Criteria

- ✅ Smart contract deploys to Sepolia
- ✅ Can issue certificate (store hash)
- ✅ Can verify certificate (check hash)
- ✅ Frontend works with MetaMask
- ✅ Demo runs smoothly
- ✅ Code is documented
- ✅ You understand what you built!

**Don't stress about perfection - focus on learning and functionality!**

---

## 📞 Need Help?

- Check documentation files
- Search Stack Overflow
- Ask in Ethereum Discord/Reddit
- Review example DApps on GitHub

---

## ⚠️ Important Notes

1. **This is for learning**: Don't worry about production-level code
2. **Sepolia is testnet**: Free ETH, safe to experiment
3. **Keep private keys safe**: Never commit to GitHub
4. **Document your learning**: Great for reports/presentations
5. **Have fun!**: Building on blockchain is exciting!

---

**Project**: Academic Transcript Verification DApp  
**Focus**: Simple, Functional, Educational  
**Timeline**: 2-3 weeks  
**Goal**: Working demo + solid understanding  

