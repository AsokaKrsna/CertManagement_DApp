# 🧪 Testing Your Live DApp - Step by Step

## Prerequisites Checklist
- [ ] Contract deployed: ✅ `0xA2710012eE8a515e340f90B2f4952ad621F0e118`
- [ ] Frontend running: `cd frontend && python -m http.server 8000`
- [ ] MetaMask installed and connected to Sepolia
- [ ] Browser open at: http://localhost:8000

---

## 🎯 Test #1: Connect Wallet & Check Admin Status

### Steps:
1. Open http://localhost:8000
2. Click **"Connect MetaMask"** button
3. MetaMask popup appears → Click **"Next"** → **"Connect"**
4. Check the top of the page

### Expected Result:
- ✅ Your wallet address shown (shortened)
- ✅ Badge shows **"ADMIN"** (red badge)
- ✅ Network shows **"Sepolia Testnet"**
- ✅ All tabs are visible (Verify, Issue, Admin)

### Troubleshooting:
- If network shows wrong: Switch MetaMask to Sepolia
- If badge shows "USER": You might not be connected with deployer wallet

---

## 🎯 Test #2: Check Contract Statistics

### Steps:
1. Go to **"Admin Panel"** tab
2. Scroll down to **"Statistics"** section

### Expected Result:
- ✅ **Total Certificates**: 0 (since no certificates issued yet)
- ✅ **Contract Address**: Shows shortened version of contract address

---

## 🎯 Test #3: Add a Registrar (Admin Function)

### Steps:
1. Stay in **"Admin Panel"** tab
2. Find **"Add Registrar"** section
3. Enter a test address:
   - Use another MetaMask account OR
   - Use a friend's address OR
   - Create new MetaMask account for testing
4. Click **"Add Registrar"**
5. MetaMask pops up → Review transaction → **"Confirm"**
6. Wait for confirmation (10-20 seconds)

### Expected Result:
- ✅ Loading overlay appears
- ✅ Toast notification: "Registrar added successfully!"
- ✅ Success message in green box

### To Verify:
1. Go to **"Check Registrar Status"** section
2. Enter the same address
3. Click **"Check Status"**
4. Should show: "✅ This address is a REGISTRAR"

---

## 🎯 Test #4: Prepare Test Certificate

### Steps:

#### A. Create a Simple Certificate (PDF)
1. Open Word/Google Docs
2. Create a certificate with:
   ```
   CERTIFICATE OF COMPLETION
   
   This is to certify that
   [Student Name]
   
   Has successfully completed
   [Course Name]
   
   Date: [Today's Date]
   Institution: [Your Institution]
   ```
3. Save/Download as PDF: `test-certificate.pdf`

#### B. Upload to Google Drive
1. Go to https://drive.google.com
2. Click **"New"** → **"File Upload"**
3. Upload `test-certificate.pdf`
4. Right-click on uploaded file → **"Share"**
5. Click **"Change to anyone with the link"**
6. Set to **"Viewer"**
7. Click **"Copy link"**
8. **Save this link** (you'll need it!)

Example link:
```
https://drive.google.com/file/d/1abc123XYZ-example/view?usp=sharing
```

---

## 🎯 Test #5: Issue a Certificate

### Steps:
1. Go to **"Issue Certificate"** tab
2. Fill in the form:

   **Student Wallet Address:**
   - Enter any valid Ethereum address
   - Can use your own address for testing
   - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

   **Upload Certificate:**
   - Click "Choose File"
   - Select your `test-certificate.pdf`
   - (This is used to generate the hash)

   **Google Drive Shareable Link:**
   - Paste the link you copied from Google Drive
   - Make sure it's the full link

   **Student Name (optional):**
   - Enter: "John Doe" (or any name)

   **Course/Degree (optional):**
   - Enter: "Web3 Development Course"

3. Click **"Issue Certificate"**
4. MetaMask pops up → **"Confirm"** transaction
5. Wait for confirmation (10-20 seconds)

### Expected Result:
- ✅ Loading overlay appears
- ✅ Toast: "Certificate issued successfully!"
- ✅ Green success box shows:
  - Certificate Hash (looks like: `0xabc123...`)
  - Student Address
  - Transaction Hash
- ✅ **IMPORTANT**: Copy and save the Certificate Hash!

### Save This:
```
Certificate Hash: 0x[copy the full hash here]
```

---

## 🎯 Test #6: Verify the Certificate

### Steps:

#### Method 1: Using Hash
1. Go to **"Verify Certificate"** tab
2. Make sure **"Certificate Hash"** is selected in dropdown
3. Paste the certificate hash you saved
4. Click **"Verify Certificate"**
5. Wait 2-3 seconds

### Expected Result:
- ✅ Green box appears: **"✅ Certificate Valid"**
- ✅ Shows all details:
  - Certificate Hash
  - Student Address (the one you entered)
  - Issued By (your admin address)
  - Issue Date (current date/time)
  - Google Drive Link (clickable)
  - Status: **"✅ ACTIVE"**

#### Method 2: Using File
1. Select **"Upload Certificate File"** in dropdown
2. Upload the same `test-certificate.pdf`
3. Click **"Verify Certificate"**
4. Should show same valid result!

---

## 🎯 Test #7: View on Etherscan

### Steps:
1. Go to: https://sepolia.etherscan.io/address/0xA2710012eE8a515e340f90B2f4952ad621F0e118
2. Click **"Transactions"** tab
3. You should see your transactions:
   - Contract Creation
   - Add Registrar
   - Issue Certificate

### What to Check:
- ✅ All transactions show "Success" ✅
- ✅ Transaction details match your actions
- ✅ You can see events emitted

---

## 🎯 Test #8: Test Revocation (Optional)

### Steps:
1. Go to **"Admin Panel"** tab
2. Find **"Revoke Certificate"** section
3. Enter the certificate hash you saved earlier
4. Enter reason: "Testing revocation feature"
5. Click **"Revoke Certificate"**
6. Confirm in MetaMask
7. Wait for confirmation

### Expected Result:
- ✅ Success message
- ✅ Now go to Verify tab and verify again
- ✅ Should show: **"❌ REVOKED"** in red

---

## 🎯 Test #9: Test from Different Wallet (Optional)

### Steps:
1. Switch to different MetaMask account (not admin)
2. Refresh page
3. Connect wallet
4. Badge should show **"USER"** (not admin or registrar)
5. Try to issue certificate → Should fail or show error
6. Verification should still work!

---

## 📊 Final Checklist

Mark off what you've successfully tested:

- [ ] ✅ Connected wallet and saw admin badge
- [ ] ✅ Viewed contract statistics
- [ ] ✅ Added a registrar successfully
- [ ] ✅ Created test certificate PDF
- [ ] ✅ Uploaded certificate to Google Drive
- [ ] ✅ Issued certificate successfully
- [ ] ✅ Saved certificate hash
- [ ] ✅ Verified certificate by hash
- [ ] ✅ Verified certificate by file upload
- [ ] ✅ Viewed transactions on Etherscan
- [ ] ✅ (Optional) Tested revocation
- [ ] ✅ (Optional) Tested from non-admin wallet

---

## 🐛 Common Issues & Solutions

### Issue: "Please connect your wallet first"
**Solution:** Click "Connect MetaMask" button at top

### Issue: "Only registrars can issue certificates"
**Solution:** Make sure you're connected with admin wallet (deployer) or added as registrar

### Issue: "Transaction failed"
**Solution:** 
- Check you have enough Sepolia ETH
- Check gas limit isn't too low
- Try again after a few seconds

### Issue: Certificate not found
**Solution:**
- Make sure you copied the full hash (starts with 0x)
- Check you're on Sepolia network
- Wait a few seconds and try again

### Issue: Google Drive link not working
**Solution:**
- Make sure link is set to "Anyone with the link can view"
- Use the full shareable link

---

## 🎉 Success Criteria

Your DApp is working perfectly if:

✅ **All operations complete without errors**  
✅ **Transactions confirm on Sepolia**  
✅ **Verification returns correct information**  
✅ **Google Drive links are accessible**  
✅ **Admin/registrar roles work as expected**  

---

## 📸 Take Screenshots!

Capture these for your portfolio/documentation:
1. Connected wallet showing admin badge
2. Successful certificate issuance
3. Certificate verification result
4. Etherscan transactions page
5. Admin panel with statistics

---

## 🚀 Next: Deploy Frontend Publicly

Once all tests pass, deploy your frontend:

```bash
# Option 1: GitHub Pages
git add .
git commit -m "Tested and working"
git push

# Option 2: Vercel
cd frontend
vercel

# Option 3: Netlify
# Drag frontend folder to netlify.com/drop
```

---

**Congratulations! If all tests pass, your DApp is production-ready! 🎓🚀**
