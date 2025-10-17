# Frontend - Transcript Verification DApp

## 📁 Files Overview

- **index.html** - Main HTML structure with tabs for verification, issuance, and admin panel
- **styles.css** - Complete styling with responsive design
- **config.js** - Configuration file (contract address and ABI)
- **app.js** - Main application logic with Web3 integration

## 🚀 Getting Started

### 1. Deploy the Smart Contract

First, deploy your smart contract to Ganache or Sepolia:

```bash
# For local testing with Ganache
npx truffle migrate --network development

# For Sepolia testnet
npx truffle migrate --network sepolia
```

After deployment, you'll get a contract address like:
```
> contract address: 0x1234567890abcdef...
```

### 2. Update Configuration

Open `frontend/config.js` and update the contract address:

```javascript
const CONFIG = {
    // UPDATE THIS with your deployed contract address
    CONTRACT_ADDRESS: "0xYourContractAddressHere",
    // ... rest of config
};
```

### 3. Run the Frontend

You can use any static file server. Here are a few options:

**Option A: Using Python**
```bash
cd frontend
python -m http.server 8000
```
Then open http://localhost:8000

**Option B: Using Node.js http-server**
```bash
npm install -g http-server
cd frontend
http-server
```
Then open http://localhost:8080

**Option C: Using VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎯 Features

### For Everyone (Public)
- **Verify Certificate** - Check if a certificate is authentic
  - Enter certificate hash directly
  - Upload certificate file to generate hash
  - Verify using Google Drive link (coming soon)

### For Registrars
- **Issue Certificate** - Create new certificates
  - Enter student wallet address
  - Upload certificate to Google Drive
  - Provide Google Drive shareable link
  - System automatically generates certificate hash

### For Admin
- **Add Registrars** - Authorize new registrars
- **Remove Registrars** - Revoke registrar access
- **Check Status** - Verify if an address is a registrar
- **Revoke Certificates** - Cancel issued certificates
- **View Statistics** - Total certificates and contract info

## 🔐 How It Works

### Certificate Issuance Flow

1. **Registrar uploads certificate to Google Drive**
   - Create PDF certificate
   - Upload to Google Drive
   - Set sharing to "Anyone with link can view"
   - Copy shareable link

2. **Registrar issues certificate via DApp**
   - Connect MetaMask wallet
   - Go to "Issue Certificate" tab
   - Upload the same certificate file (for hash generation)
   - Enter student wallet address
   - Paste Google Drive link
   - Click "Issue Certificate"

3. **System stores on blockchain**
   - Hash of certificate (SHA-256)
   - Student address
   - Google Drive link
   - Issue timestamp
   - Issuer address

### Certificate Verification Flow

1. **Anyone can verify**
   - No wallet connection required for verification
   - Just connect to view results

2. **Three verification methods**
   - **Hash**: If you have the certificate hash
   - **File**: Upload certificate file to generate hash
   - **Drive Link**: Paste Google Drive link (coming soon)

3. **Verification shows**
   - Certificate validity (✅ Valid / ❌ Invalid)
   - Student address
   - Issuer address
   - Issue date
   - Status (Active / Revoked)
   - Link to view original certificate

## 📱 User Interface

### Responsive Design
- Desktop: Full-width layout with tabs
- Tablet: Optimized for medium screens
- Mobile: Stack layout with vertical tabs

### Color Coding
- 🔵 Blue: Primary actions (Connect, Verify)
- 🟢 Green: Success actions (Issue, Add)
- 🔴 Red: Danger actions (Revoke, Remove)
- ⚫ Gray: Neutral/Info

### Notifications
- Toast messages (top-right corner)
- Success/Error/Info states
- Auto-dismiss after 5 seconds

## 🛠️ Technical Details

### Dependencies
- **ethers.js v5.7.2** - Web3 library for Ethereum interaction
- Uses CDN (no npm install required)

### Browser Support
- Chrome/Edge (Recommended)
- Firefox
- Brave
- Any browser with MetaMask extension

### MetaMask Integration
- Auto-detects MetaMask
- Connects to user's selected network
- Handles account changes
- Handles network changes

### File Hashing
- Uses Web Crypto API
- SHA-256 algorithm
- Client-side processing
- No server upload required

## 🔧 Configuration Options

### Supported Networks

**Ganache (Local Testing)**
```javascript
1337: {
    name: "Ganache Local",
    rpcUrl: "http://127.0.0.1:7545",
    chainId: 1337
}
```

**Sepolia Testnet**
```javascript
11155111: {
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    chainId: 11155111,
    blockExplorer: "https://sepolia.etherscan.io"
}
```

### Adding More Networks

Edit `config.js` and add to NETWORKS object:
```javascript
NETWORKS: {
    1: {
        name: "Ethereum Mainnet",
        rpcUrl: "https://mainnet.infura.io/v3/YOUR_KEY",
        chainId: 1,
        blockExplorer: "https://etherscan.io"
    },
    // Add more networks...
}
```

## 🐛 Troubleshooting

### "Please install MetaMask"
- Install MetaMask browser extension
- Reload the page

### "Failed to connect wallet"
- Check MetaMask is unlocked
- Try disconnecting and reconnecting
- Refresh the page

### "Wrong network"
- Switch to Ganache (1337) or Sepolia (11155111) in MetaMask
- Click your network in MetaMask
- Select the correct network

### "Transaction failed"
- Check you have enough ETH for gas
- Verify you have the correct role (admin/registrar)
- Check contract address is correct

### "Contract not found"
- Verify CONTRACT_ADDRESS in config.js is correct
- Ensure contract is deployed to the connected network
- Check network in MetaMask matches deployment network

## 📝 Development Notes

### Adding New Features

1. **Add UI elements** in `index.html`
2. **Style them** in `styles.css`
3. **Add event handlers** in `app.js`
4. **Call contract methods** using `this.contract.methodName()`

### Testing Locally

1. Start Ganache on port 7545
2. Deploy contract to Ganache
3. Update config.js with contract address
4. Open frontend in browser
5. Connect MetaMask to Ganache network

### Contract ABI Updates

If you modify the smart contract:
1. Recompile: `npx truffle compile`
2. Get new ABI from `build/contracts/TranscriptVerification.json`
3. Update CONTRACT_ABI in `config.js`

## 🎨 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #3B82F6;  /* Change primary color */
    --success-color: #10B981;  /* Change success color */
    /* ... */
}
```

### Changing Layout
Modify grid/flex properties in CSS:
```css
.container {
    max-width: 1200px;  /* Change max width */
}
```

### Adding Logos
Add logo image and update header in `index.html`:
```html
<header>
    <img src="logo.png" alt="Logo">
    <h1>Your Institution Name</h1>
</header>
```

## 📊 Analytics (Optional)

To track usage, you can add:
- Google Analytics
- Mixpanel
- Custom event tracking

Add tracking code in `index.html` before closing `</body>` tag.

## 🔒 Security Notes

- Never hardcode private keys
- All sensitive operations require MetaMask signature
- File hashing happens client-side
- No server-side processing required
- Contract address is public (this is normal)

## 📚 Resources

- [ethers.js Documentation](https://docs.ethers.io/v5/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Web3 Tutorial](https://ethereum.org/en/developers/docs/web3/)

---

**Ready to launch your DApp? Follow the steps above and start verifying certificates! 🎓**
