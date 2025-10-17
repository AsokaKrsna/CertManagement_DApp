# Academic Project - Simplified Approach

## 🎓 Project Scope (Academic Focused)

This document outlines the **simplified, practical approach** for the academic version of the Transcript Verification DApp.

---

## 🎯 Key Simplifications

### 1. **Frontend: Vanilla Web Technologies**
- ❌ **NOT using**: React, Vue, complex frameworks
- ✅ **USING**: HTML, CSS, JavaScript (ES6+)
- **Why**: Simpler, faster to build, easier to understand

### 2. **Storage: Google Drive + Blockchain Hash**
- ❌ **NOT using**: IPFS, complex pinning services
- ✅ **USING**: Google Drive for files, blockchain for hashes
- **Why**: Familiar tool, easy to manage, practical for academics

### 3. **Focus: Core Functionality**
- ❌ **NOT building**: Complex admin dashboards, analytics, NFTs
- ✅ **BUILDING**: Issue, Verify, basic Revocation
- **Why**: Time-efficient, demonstrates core concepts

---

## 🏗️ Simplified Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (HTML/CSS/JS)              │
│                                             │
│  index.html     - Landing page              │
│  issue.html     - Issue certificates        │
│  verify.html    - Verify certificates       │
│  admin.html     - Add registrars (optional) │
└─────────────────┬───────────────────────────┘
                  │
          ┌───────▼────────┐
          │    MetaMask    │
          │   (Web3 Auth)  │
          └───────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐   ┌────▼────┐   ┌───▼────┐
│ Smart  │   │ Google  │   │  RPC   │
│Contract│   │  Drive  │   │ Provider│
└────────┘   └─────────┘   └────────┘
 (Sepolia)    (Storage)     (Infura)

Data Flow:
1. Certificate → Google Drive → Get Link
2. File → Hash (SHA-256 in browser)
3. Hash + Link → Smart Contract
4. Verify: File → Hash → Check Blockchain
```

---

## 📊 Storage Strategy (Google Drive Approach)

### Certificate Issuance Flow

```
1. Registrar creates certificate (PDF/Image)
   ↓
2. Manually upload to Google Drive
   ↓
3. Make shareable (anyone with link can view)
   ↓
4. Copy share link
   ↓
5. On DApp: Upload same file
   ↓
6. JavaScript calculates hash (SHA-256)
   ↓
7. Submit: Hash + Drive Link + Student Address
   ↓
8. Smart Contract stores: Hash, Link, Metadata
   ↓
9. Certificate hash shown to user
```

### Certificate Verification Flow

**Option A: Upload File**
```
1. User uploads certificate file
   ↓
2. Calculate hash in browser
   ↓
3. Query blockchain with hash
   ↓
4. If exists & not revoked → VALID
   ↓
5. Show certificate details + Drive link
```

**Option B: Enter Hash**
```
1. User pastes certificate hash
   ↓
2. Query blockchain directly
   ↓
3. Show result
```

**Option C: Google Drive Link**
```
1. User pastes Drive link
   ↓
2. Fetch file from Drive (if public)
   ↓
3. Calculate hash
   ↓
4. Verify on blockchain
```

**Recommended for Demo**: Support all three for flexibility!

---

## 🔧 Technical Implementation

### Smart Contract (Simplified)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TranscriptVerification {
    address public admin;
    mapping(address => bool) public registrars;
    
    struct Certificate {
        bytes32 certHash;           // Hash of certificate file
        address issuer;             // Who issued
        address student;            // Student address
        string driveLink;           // Google Drive link
        uint256 timestamp;          // When issued
        bool revoked;               // Revocation status
    }
    
    // Hash to Certificate
    mapping(bytes32 => Certificate) public certificates;
    mapping(bytes32 => bool) public exists;
    
    event CertificateIssued(bytes32 indexed certHash, address indexed student, address indexed issuer);
    event CertificateRevoked(bytes32 indexed certHash, address indexed issuer);
    event RegistrarAdded(address indexed registrar);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyRegistrar() {
        require(registrars[msg.sender], "Only registrar");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        registrars[msg.sender] = true; // Admin is also registrar
    }
    
    function addRegistrar(address _registrar) public onlyAdmin {
        registrars[_registrar] = true;
        emit RegistrarAdded(_registrar);
    }
    
    function issueCertificate(
        bytes32 _certHash,
        address _student,
        string memory _driveLink
    ) public onlyRegistrar {
        require(!exists[_certHash], "Certificate already exists");
        
        certificates[_certHash] = Certificate({
            certHash: _certHash,
            issuer: msg.sender,
            student: _student,
            driveLink: _driveLink,
            timestamp: block.timestamp,
            revoked: false
        });
        
        exists[_certHash] = true;
        emit CertificateIssued(_certHash, _student, msg.sender);
    }
    
    function verifyCertificate(bytes32 _certHash) 
        public view returns (bool valid, Certificate memory cert) 
    {
        if (exists[_certHash]) {
            cert = certificates[_certHash];
            valid = !cert.revoked;
        }
    }
    
    function revokeCertificate(bytes32 _certHash) public onlyRegistrar {
        require(exists[_certHash], "Certificate not found");
        require(certificates[_certHash].issuer == msg.sender, "Not issuer");
        require(!certificates[_certHash].revoked, "Already revoked");
        
        certificates[_certHash].revoked = true;
        emit CertificateRevoked(_certHash, msg.sender);
    }
}
```

---

## 💻 Frontend Implementation

### File Structure
```
frontend/
├── index.html          # Landing page with navigation
├── issue.html          # Issue certificate page
├── verify.html         # Verify certificate page
├── admin.html          # Admin panel (add registrars)
├── css/
│   └── style.css       # Styling (or use Bootstrap CDN)
└── js/
    ├── app.js          # Main app logic, MetaMask connection
    ├── contract.js     # Contract ABI and address
    └── utils.js        # Hash calculation, helpers
```

### Key JavaScript Functions

**Calculate File Hash** (`utils.js`)
```javascript
async function calculateFileHash(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return '0x' + hashHex;
    } catch (error) {
        console.error('Error calculating hash:', error);
        throw error;
    }
}

function shortHash(hash) {
    return hash.substring(0, 10) + '...' + hash.substring(hash.length - 8);
}
```

**Connect MetaMask** (`app.js`)
```javascript
let provider, signer, account;

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return false;
    }
    
    try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        account = await signer.getAddress();
        
        // Check network
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) { // Sepolia
            alert('Please switch to Sepolia network!');
            return false;
        }
        
        // Update UI
        document.getElementById('walletAddress').textContent = 
            account.substring(0, 6) + '...' + account.substring(account.length - 4);
        document.getElementById('connectBtn').textContent = 'Connected';
        
        return true;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
        return false;
    }
}

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
            location.reload();
        }
    });
    
    window.ethereum.on('chainChanged', () => {
        location.reload();
    });
}
```

**Contract Interaction** (`contract.js`)
```javascript
// Contract ABI (copy from Truffle build/contracts)
const CONTRACT_ABI = [ /* ... ABI array ... */ ];

// Contract Address (update after deployment)
const CONTRACT_ADDRESS = "0x..."; // Update after deploying to Sepolia

function getContract() {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

async function issueCertificate(certHash, studentAddress, driveLink) {
    try {
        const contract = getContract();
        
        // Show loading
        showLoading('Issuing certificate...');
        
        const tx = await contract.issueCertificate(certHash, studentAddress, driveLink);
        
        showLoading('Waiting for confirmation...');
        await tx.wait();
        
        hideLoading();
        showSuccess('Certificate issued successfully!<br>Hash: ' + shortHash(certHash));
        
    } catch (error) {
        hideLoading();
        showError('Failed to issue certificate: ' + error.message);
    }
}

async function verifyCertificate(certHash) {
    try {
        const contract = getContract();
        
        const [valid, cert] = await contract.verifyCertificate(certHash);
        
        if (!cert.issuer || cert.issuer === '0x0000000000000000000000000000000000000000') {
            showResult('NOT FOUND', 'This certificate does not exist on the blockchain.', 'danger');
            return;
        }
        
        if (cert.revoked) {
            showResult('REVOKED', 'This certificate has been revoked.', 'warning');
            return;
        }
        
        // Valid certificate
        const resultHTML = `
            <strong>✅ VALID CERTIFICATE</strong><br><br>
            <strong>Student:</strong> ${cert.student}<br>
            <strong>Issued by:</strong> ${cert.issuer}<br>
            <strong>Date:</strong> ${new Date(Number(cert.timestamp) * 1000).toLocaleString()}<br>
            <strong>Google Drive:</strong> <a href="${cert.driveLink}" target="_blank">View Certificate</a>
        `;
        
        showResult('VALID', resultHTML, 'success');
        
    } catch (error) {
        showError('Verification failed: ' + error.message);
    }
}
```

**Issue Certificate Page** (`issue.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Issue Certificate - Transcript Verification</title>
    <link rel="stylesheet" href="css/style.css">
    <!-- Or use Bootstrap CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>Issue Certificate</h1>
        
        <button id="connectBtn" onclick="connectWallet()">Connect MetaMask</button>
        <p>Connected: <span id="walletAddress">Not connected</span></p>
        
        <hr>
        
        <form id="issueForm">
            <div class="mb-3">
                <label>Student Address:</label>
                <input type="text" id="studentAddress" class="form-control" placeholder="0x..." required>
            </div>
            
            <div class="mb-3">
                <label>Certificate File (PDF/Image):</label>
                <input type="file" id="certFile" class="form-control" accept=".pdf,.png,.jpg" required>
            </div>
            
            <div class="mb-3">
                <label>Google Drive Link:</label>
                <input type="url" id="driveLink" class="form-control" placeholder="https://drive.google.com/..." required>
            </div>
            
            <button type="submit" class="btn btn-primary">Issue Certificate</button>
        </form>
        
        <div id="result" class="mt-3"></div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.umd.min.js"></script>
    <script src="js/contract.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/app.js"></script>
    <script>
        document.getElementById('issueForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!account) {
                alert('Please connect MetaMask first!');
                return;
            }
            
            const studentAddr = document.getElementById('studentAddress').value;
            const fileInput = document.getElementById('certFile');
            const driveLink = document.getElementById('driveLink').value;
            
            if (!fileInput.files[0]) {
                alert('Please select a certificate file');
                return;
            }
            
            // Calculate hash
            const certHash = await calculateFileHash(fileInput.files[0]);
            
            // Issue certificate
            await issueCertificate(certHash, studentAddr, driveLink);
        });
    </script>
</body>
</html>
```

---

## ✅ Minimum Viable Features (Academic)

### Must Have (Week 1-2)
- [x] Smart contract with basic structure
- [x] Issue certificate function
- [x] Verify certificate function
- [x] Simple HTML pages
- [x] MetaMask connection
- [x] File hash calculation
- [x] Deploy to Sepolia

### Nice to Have (Week 3)
- [ ] Revocation functionality
- [ ] Admin panel to add registrars
- [ ] Better UI with Bootstrap
- [ ] Form validation
- [ ] Loading indicators

### Optional (If Time)
- [ ] Google Drive API integration (fetch files)
- [ ] Certificate details in nice card format
- [ ] Search by student address
- [ ] Transaction history

---

## 📅 Academic Timeline (Realistic)

### Week 1: Smart Contract & Setup
- **Day 1-2**: Environment setup, understand blockchain basics
- **Day 3-4**: Write smart contract, write tests
- **Day 5-6**: Deploy to Ganache, test locally
- **Day 7**: Deploy to Sepolia

### Week 2: Frontend Development
- **Day 8-9**: HTML structure, CSS styling
- **Day 10-11**: JavaScript logic, Web3 integration
- **Day 12-13**: Issue certificate flow
- **Day 14**: Verify certificate flow

### Week 3: Testing & Polish
- **Day 15-16**: End-to-end testing
- **Day 17**: Fix bugs, improve UI
- **Day 18**: Documentation, screenshots
- **Day 19-20**: Demo preparation
- **Day 21**: Final presentation!

**Total**: 3 weeks (flexible based on your pace)

---

## 🎬 Demo Script (5-10 minutes)

### Setup (Before Demo)
1. ✅ Have Ganache/Sepolia running
2. ✅ Contract deployed
3. ✅ Frontend open in browser
4. ✅ MetaMask connected
5. ✅ Sample certificate in Google Drive
6. ✅ Two browser windows (registrar + verifier)

### Demo Flow
1. **Intro** (1 min)
   - Explain the problem: Certificate forgery
   - Show solution: Blockchain verification

2. **Issue Certificate** (3 min)
   - Connect MetaMask as registrar
   - Show certificate in Google Drive
   - Upload file, enter student address
   - Enter Drive link
   - Click "Issue" → Show hash generated
   - Transaction confirms → Certificate issued

3. **Verify Certificate** (3 min)
   - New window (verifier perspective)
   - **Test 1**: Upload correct certificate → VALID ✅
   - **Test 2**: Upload different file → NOT FOUND ❌
   - **Test 3**: Enter hash directly → Show details

4. **Show Smart Contract** (2 min)
   - Show contract on Sepolia Etherscan
   - Show transaction history
   - Explain transparency

5. **Q&A** (2 min)

---

## 💡 Academic Project Tips

### For Report/Documentation
1. **Problem Statement**: Why blockchain for certificates?
2. **Existing Solutions**: Traditional methods, limitations
3. **Proposed Solution**: Your DApp architecture
4. **Implementation**: Tech stack, code snippets
5. **Testing**: Screenshots, test results
6. **Conclusion**: What you learned

### For Presentation
1. Start with demo (people love demos!)
2. Explain how it works
3. Show code (briefly)
4. Discuss challenges faced
5. Future improvements

### For Code Submission
1. ✅ Clean, commented code
2. ✅ README with setup instructions
3. ✅ Screenshots/video
4. ✅ Contract address on Sepolia
5. ✅ Test results

---

## 🎯 Success Criteria (Academic Version)

Your project is successful if:
- ✅ Smart contract works on Sepolia
- ✅ Can issue certificate (hash stored)
- ✅ Can verify certificate (validation works)
- ✅ Frontend is functional (doesn't need to be beautiful)
- ✅ Demo runs without major issues
- ✅ You can explain how it works
- ✅ Code is reasonably documented

**Focus on learning, not perfection!** 🎓

---

## 📝 Documentation for Submission

### README.md (Keep Simple)
```markdown
# Certificate Verification DApp

## What it does
- Issues certificates with blockchain verification
- Verifies certificate authenticity
- Prevents forgery using cryptographic hashing

## Tech Stack
- Solidity, Truffle
- HTML, CSS, JavaScript
- ethers.js, MetaMask
- Sepolia testnet

## Setup
1. Install Node.js, Truffle
2. `npm install`
3. `truffle migrate --network sepolia`
4. Update contract address in frontend
5. Open `frontend/index.html`

## Contract Address
Sepolia: 0x... (add after deployment)
```

---

## 🚀 Let's Get Started!

### Your Next Steps

1. **Today**: 
   - Review this simplified approach
   - Setup Node.js, Truffle, MetaMask
   - Get Sepolia test ETH

2. **Tomorrow**:
   - Create basic smart contract
   - Write simple tests
   - Deploy to Ganache

3. **This Week**:
   - Finish smart contract
   - Deploy to Sepolia
   - Start HTML pages

**You've got this! The simplified approach is totally doable! 💪**

---

**Remember**: 
- Simple is better than complex
- Working demo > fancy features
- Learning > perfection
- Ask for help when stuck!

**Good luck with your academic project! 🎓🚀**
