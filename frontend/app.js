// Main DApp Application Logic

// Check if ethers.js is loaded
if (typeof ethers === 'undefined') {
    console.error('ethers.js not loaded! Please check your internet connection.');
    alert('Error: Web3 library (ethers.js) failed to load. Please check your internet connection and refresh the page.');
}

class TranscriptDApp {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.currentAccount = null;
        this.isAdmin = false;
        this.isRegistrar = false;
        
        this.init();
    }
    
    async init() {
        // Check if ethers is available before proceeding
        if (typeof ethers === 'undefined') {
            console.error('Cannot initialize DApp: ethers.js not loaded');
            return;
        }
        
        this.setupEventListeners();
        await this.checkMetaMask();
    }
    
    // Check if MetaMask is installed
    async checkMetaMask() {
        if (typeof window.ethereum === 'undefined') {
            this.showToast('Please install MetaMask to use this DApp', 'error');
            return false;
        }
        return true;
    }
    
    // Check and switch to correct network
    async checkNetwork() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const network = await provider.getNetwork();
            
            // Check if on Sepolia (11155111) or Ganache (1337)
            if (network.chainId !== 11155111 && network.chainId !== 1337) {
                const switchToSepolia = confirm(
                    `You are on the wrong network (Chain ID: ${network.chainId}).\n\n` +
                    `This DApp requires Sepolia Testnet.\n\n` +
                    `Click OK to switch to Sepolia.`
                );
                
                if (switchToSepolia) {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }], // Sepolia
                    });
                    return true;
                }
                return false;
            }
            return true;
        } catch (error) {
            console.error('Network check error:', error);
            return false;
        }
    }
    
    // Connect to MetaMask wallet
    async connectWallet() {
        try {
            if (!await this.checkMetaMask()) return;
            
            this.showLoading(true);
            
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            this.currentAccount = accounts[0];
            
            // Setup provider and signer using window.ethereum
            this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            
            // Wait for network to be ready
            await this.provider.ready;
            
            this.signer = this.provider.getSigner();
            
            // Get network info
            const network = await this.provider.getNetwork();
            const networkInfo = CONFIG.NETWORKS[network.chainId];
            
            // Check if on supported network
            if (!networkInfo) {
                this.showLoading(false);
                this.showToast(`Please switch to Sepolia Testnet (Chain ID: 11155111). You are on Chain ID: ${network.chainId}`, 'error');
                
                // Try to switch to Sepolia
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
                    });
                    // If successful, retry connection
                    return await this.connectWallet();
                } catch (switchError) {
                    console.error('Failed to switch network:', switchError);
                    this.showToast('Please manually switch to Sepolia network in MetaMask', 'error');
                    return;
                }
            }
            
            document.getElementById('networkName').textContent = networkInfo.name;
            
            // Initialize contract
            this.contract = new ethers.Contract(
                CONFIG.CONTRACT_ADDRESS,
                CONFIG.CONTRACT_ABI,
                this.signer
            );
            
            // Check user role
            await this.checkUserRole();
            
            // Update UI
            this.updateWalletUI();
            
            // Load statistics
            await this.loadStatistics();
            
            this.showToast('Wallet connected successfully!', 'success');
            this.showLoading(false);
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnectWallet();
                } else {
                    this.currentAccount = accounts[0];
                    this.checkUserRole();
                    this.updateWalletUI();
                }
            });
            
            // Listen for network changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
            
        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showToast('Failed to connect wallet: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Check if user is admin or registrar
    async checkUserRole() {
        try {
            const adminAddress = await this.contract.admin();
            this.isAdmin = adminAddress.toLowerCase() === this.currentAccount.toLowerCase();
            this.isRegistrar = await this.contract.isRegistrar(this.currentAccount);
        } catch (error) {
            console.error('Error checking role:', error);
        }
    }
    
    // Disconnect wallet
    disconnectWallet() {
        this.currentAccount = null;
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.isAdmin = false;
        this.isRegistrar = false;
        
        document.getElementById('connectWallet').style.display = 'inline-flex';
        document.getElementById('walletInfo').style.display = 'none';
    }
    
    // Update wallet UI
    updateWalletUI() {
        const shortAddress = this.currentAccount.substring(0, 6) + '...' + 
                           this.currentAccount.substring(38);
        
        document.getElementById('walletAddress').textContent = shortAddress;
        
        const roleElement = document.getElementById('walletRole');
        if (this.isAdmin) {
            roleElement.textContent = 'ADMIN';
            roleElement.className = 'badge admin';
        } else if (this.isRegistrar) {
            roleElement.textContent = 'REGISTRAR';
            roleElement.className = 'badge registrar';
        } else {
            roleElement.textContent = 'USER';
            roleElement.className = 'badge';
        }
        
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('walletInfo').style.display = 'inline-flex';
    }
    
    // Load statistics
    async loadStatistics() {
        try {
            const totalCerts = await this.contract.getTotalCertificates();
            document.getElementById('totalCerts').textContent = totalCerts.toString();
            
            const shortContract = CONFIG.CONTRACT_ADDRESS.substring(0, 6) + '...' + 
                                CONFIG.CONTRACT_ADDRESS.substring(38);
            document.getElementById('contractAddress').textContent = shortContract;
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }
    
    // Verify certificate
    async verifyCertificate(certHash) {
        if (!this.contract) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            const [valid, certificate] = await this.contract.verifyCertificate(certHash);
            
            const resultBox = document.getElementById('verifyResult');
            resultBox.style.display = 'block';
            
            if (valid) {
                const issueDate = new Date(certificate.issueDate.toNumber() * 1000);
                
                resultBox.className = 'result-box success';
                resultBox.innerHTML = `
                    <h4>✅ Certificate Valid</h4>
                    <div class="result-detail">
                        <strong>Certificate Hash:</strong>
                        <span>${certHash}</span>
                    </div>
                    <div class="result-detail">
                        <strong>Student Address:</strong>
                        <span>${certificate.student}</span>
                    </div>
                    <div class="result-detail">
                        <strong>Issued By:</strong>
                        <span>${certificate.issuer}</span>
                    </div>
                    <div class="result-detail">
                        <strong>Issue Date:</strong>
                        <span>${issueDate.toLocaleString()}</span>
                    </div>
                    <div class="result-detail">
                        <strong>Google Drive Link:</strong>
                        <span><a href="${certificate.driveLink}" target="_blank">View Certificate</a></span>
                    </div>
                    <div class="result-detail">
                        <strong>Status:</strong>
                        <span style="color: ${certificate.revoked ? 'red' : 'green'}">
                            ${certificate.revoked ? '❌ REVOKED' : '✅ ACTIVE'}
                        </span>
                    </div>
                    ${certificate.revoked ? `
                        <div class="result-detail">
                            <strong>Revoke Date:</strong>
                            <span>${new Date(certificate.revokeDate.toNumber() * 1000).toLocaleString()}</span>
                        </div>
                    ` : ''}
                `;
            } else {
                resultBox.className = 'result-box error';
                resultBox.innerHTML = `
                    <h4>❌ Certificate Not Found</h4>
                    <p>This certificate hash does not exist in our system. Please verify the hash and try again.</p>
                `;
            }
            
            this.showLoading(false);
        } catch (error) {
            console.error('Error verifying certificate:', error);
            this.showToast('Error verifying certificate: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Issue certificate
    async issueCertificate(certHash, studentAddress, driveLink) {
        if (!this.contract) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        if (!this.isRegistrar) {
            this.showToast('Only registrars can issue certificates', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            const tx = await this.contract.issueCertificate(certHash, studentAddress, driveLink);
            await tx.wait();
            
            const resultBox = document.getElementById('issueResult');
            resultBox.style.display = 'block';
            resultBox.className = 'result-box success';
            resultBox.innerHTML = `
                <h4>✅ Certificate Issued Successfully</h4>
                <div class="result-detail">
                    <strong>Certificate Hash:</strong>
                    <span>${certHash}</span>
                </div>
                <div class="result-detail">
                    <strong>Student Address:</strong>
                    <span>${studentAddress}</span>
                </div>
                <div class="result-detail">
                    <strong>Transaction Hash:</strong>
                    <span>${tx.hash}</span>
                </div>
            `;
            
            // Clear form
            document.getElementById('issueForm').reset();
            
            // Update statistics
            await this.loadStatistics();
            
            this.showToast('Certificate issued successfully!', 'success');
            this.showLoading(false);
        } catch (error) {
            console.error('Error issuing certificate:', error);
            this.showToast('Error issuing certificate: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Add registrar (admin only)
    async addRegistrar(registrarAddress) {
        if (!this.contract) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        if (!this.isAdmin) {
            this.showToast('Only admin can add registrars', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            const tx = await this.contract.addRegistrar(registrarAddress);
            await tx.wait();
            
            this.showAdminResult(`✅ Registrar ${registrarAddress} added successfully`, 'success');
            this.showToast('Registrar added successfully!', 'success');
            this.showLoading(false);
        } catch (error) {
            console.error('Error adding registrar:', error);
            this.showToast('Error adding registrar: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Remove registrar (admin only)
    async removeRegistrar(registrarAddress) {
        if (!this.contract) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        if (!this.isAdmin) {
            this.showToast('Only admin can remove registrars', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            const tx = await this.contract.removeRegistrar(registrarAddress);
            await tx.wait();
            
            this.showAdminResult(`✅ Registrar ${registrarAddress} removed successfully`, 'success');
            this.showToast('Registrar removed successfully!', 'success');
            this.showLoading(false);
        } catch (error) {
            console.error('Error removing registrar:', error);
            this.showToast('Error removing registrar: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Check registrar status
    async checkRegistrarStatus(address) {
        if (!this.contract) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            const isReg = await this.contract.isRegistrar(address);
            const adminAddress = await this.contract.admin();
            const isAdminCheck = adminAddress.toLowerCase() === address.toLowerCase();
            
            let message = `Address: ${address}\n`;
            if (isAdminCheck) {
                message += '✅ This address is the ADMIN\n';
            }
            if (isReg) {
                message += '✅ This address is a REGISTRAR';
            } else {
                message += '❌ This address is NOT a registrar';
            }
            
            this.showAdminResult(message, 'info');
            this.showLoading(false);
        } catch (error) {
            console.error('Error checking registrar:', error);
            this.showToast('Error checking registrar: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Revoke certificate
    async revokeCertificate(certHash, reason) {
        if (!this.contract) {
            this.showToast('Please connect your wallet first', 'error');
            return;
        }
        
        if (!this.isRegistrar) {
            this.showToast('Only registrars can revoke certificates', 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            const tx = await this.contract.revokeCertificate(certHash, reason);
            await tx.wait();
            
            this.showAdminResult(`✅ Certificate ${certHash} revoked successfully`, 'success');
            this.showToast('Certificate revoked successfully!', 'success');
            this.showLoading(false);
        } catch (error) {
            console.error('Error revoking certificate:', error);
            this.showToast('Error revoking certificate: ' + error.message, 'error');
            this.showLoading(false);
        }
    }
    
    // Helper function to show admin results
    showAdminResult(message, type) {
        const resultBox = document.getElementById('adminResult');
        resultBox.style.display = 'block';
        resultBox.className = `result-box ${type}`;
        resultBox.innerHTML = `<p style="white-space: pre-line;">${message}</p>`;
    }
    
    // Hash file for verification
    async hashFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    resolve(hashHex);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    
    // Show loading overlay
    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Connect wallet button
        document.getElementById('connectWallet').addEventListener('click', () => {
            this.connectWallet();
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Verify method change
        document.getElementById('verifyMethod').addEventListener('change', (e) => {
            const method = e.target.value;
            document.getElementById('hashInput').style.display = method === 'hash' ? 'block' : 'none';
            document.getElementById('fileInput').style.display = method === 'file' ? 'block' : 'none';
            document.getElementById('driveInput').style.display = method === 'drive' ? 'block' : 'none';
        });
        
        // Verify button
        document.getElementById('verifyBtn').addEventListener('click', async () => {
            const method = document.getElementById('verifyMethod').value;
            let certHash;
            
            if (method === 'hash') {
                certHash = document.getElementById('certHash').value.trim();
                if (!certHash) {
                    this.showToast('Please enter a certificate hash', 'error');
                    return;
                }
            } else if (method === 'file') {
                const file = document.getElementById('certFile').files[0];
                if (!file) {
                    this.showToast('Please select a file', 'error');
                    return;
                }
                certHash = await this.hashFile(file);
            } else if (method === 'drive') {
                const driveLink = document.getElementById('driveLink').value.trim();
                if (!driveLink) {
                    this.showToast('Please enter a Google Drive link', 'error');
                    return;
                }
                // For Drive link, we need to fetch and hash the file
                this.showToast('Drive link verification not implemented yet. Please use hash method.', 'error');
                return;
            }
            
            await this.verifyCertificate(certHash);
        });
        
        // Issue button
        document.getElementById('issueBtn').addEventListener('click', async () => {
            const studentAddress = document.getElementById('studentAddress').value.trim();
            const googleDriveLink = document.getElementById('googleDriveLink').value.trim();
            const file = document.getElementById('certificateFile').files[0];
            
            if (!studentAddress || !googleDriveLink) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }
            
            if (!ethers.utils.isAddress(studentAddress)) {
                this.showToast('Invalid student address', 'error');
                return;
            }
            
            if (!file) {
                this.showToast('Please select a certificate file to generate hash', 'error');
                return;
            }
            
            const certHash = await this.hashFile(file);
            await this.issueCertificate(certHash, studentAddress, googleDriveLink);
        });
        
        // Admin buttons
        document.getElementById('addRegistrarBtn').addEventListener('click', async () => {
            const address = document.getElementById('newRegistrar').value.trim();
            if (!address) {
                this.showToast('Please enter an address', 'error');
                return;
            }
            if (!ethers.utils.isAddress(address)) {
                this.showToast('Invalid address', 'error');
                return;
            }
            await this.addRegistrar(address);
        });
        
        document.getElementById('removeRegistrarBtn').addEventListener('click', async () => {
            const address = document.getElementById('removeRegistrar').value.trim();
            if (!address) {
                this.showToast('Please enter an address', 'error');
                return;
            }
            if (!ethers.utils.isAddress(address)) {
                this.showToast('Invalid address', 'error');
                return;
            }
            await this.removeRegistrar(address);
        });
        
        document.getElementById('checkRegistrarBtn').addEventListener('click', async () => {
            const address = document.getElementById('checkRegistrar').value.trim();
            if (!address) {
                this.showToast('Please enter an address', 'error');
                return;
            }
            if (!ethers.utils.isAddress(address)) {
                this.showToast('Invalid address', 'error');
                return;
            }
            await this.checkRegistrarStatus(address);
        });
        
        document.getElementById('revokeBtn').addEventListener('click', async () => {
            const certHash = document.getElementById('revokeHash').value.trim();
            const reason = document.getElementById('revokeReason').value.trim();
            
            if (!certHash || !reason) {
                this.showToast('Please fill in all fields', 'error');
                return;
            }
            
            await this.revokeCertificate(certHash, reason);
        });
    }
    
    // Switch between tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName + '-tab').classList.add('active');
    }
}

// Initialize the DApp when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Check if ethers.js is loaded
    if (typeof ethers === 'undefined') {
        console.error('Cannot start DApp: ethers.js library not loaded');
        alert('Failed to load Web3 library. Please:\n1. Check your internet connection\n2. Disable ad blockers\n3. Refresh the page');
        return;
    }
    
    console.log('ethers.js loaded successfully:', ethers.version);
    window.dapp = new TranscriptDApp();
});
