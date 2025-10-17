# Project Requirements - Transcript Verification DApp

## Document Overview
This document outlines all functional and non-functional requirements for the Transcript Verification DApp.

---

## 1. Project Metadata

- **Project Name**: Transcript Verification DApp
- **Version**: 1.0.0 (MVP)
- **Target Network**: Ethereum Sepolia Testnet
- **Development Start**: October 2025
- **Estimated Timeline**: 4 weeks

---

## 2. Functional Requirements

### 2.1 User Management

#### FR-UM-001: Admin Role
**Requirement**: The system must have an admin role with the following capabilities:
- Deploy the smart contract
- Add authorized registrar addresses
- Remove registrar addresses
- Pause and unpause the contract in emergencies
- View all system activities

**Priority**: Critical
**Acceptance Criteria**:
- Only the contract deployer is the admin
- Admin functions are protected by `onlyAdmin` modifier
- Admin actions emit appropriate events

#### FR-UM-002: Registrar Role
**Requirement**: The system must support registrar accounts with the following capabilities:
- Issue certificates to students
- Revoke certificates they issued
- View certificates they issued
- Cannot modify other registrars' certificates

**Priority**: Critical
**Acceptance Criteria**:
- Only admin can add registrar addresses
- Only registrars can issue certificates
- Registrars can only revoke their own certificates
- All registrar actions are logged via events

#### FR-UM-003: Public Access (Verifiers)
**Requirement**: Anyone must be able to verify certificates without authentication
- No login required
- Read-only access to verification function
- View certificate details if valid

**Priority**: Critical
**Acceptance Criteria**:
- Verification function is public
- No gas cost for verification (view function)
- Returns complete certificate information

### 2.2 Certificate Issuance

#### FR-CI-001: Issue Certificate
**Requirement**: Registrars must be able to issue certificates with the following information:
- Student wallet address (mandatory)
- Course/degree name (mandatory)
- Institution name (mandatory)
- Grade/CGPA (optional)
- Issue date (auto-generated)
- Additional metadata (optional)

**Priority**: Critical
**Acceptance Criteria**:
- Certificate is stored on blockchain with unique ID
- Full certificate data stored on IPFS
- IPFS hash stored on blockchain
- `CertificateIssued` event emitted
- Transaction returns certificate ID
- Certificate ID is globally unique

#### FR-CI-002: Generate Unique Certificate ID
**Requirement**: Each certificate must have a cryptographically unique identifier
- ID generated using keccak256 hash
- Includes student address, course name, timestamp, and nonce
- Collision-resistant

**Priority**: Critical
**Acceptance Criteria**:
- Certificate ID is bytes32 type
- No two certificates can have same ID
- ID generation is deterministic for given inputs

#### FR-CI-003: Prevent Duplicate Certificates
**Requirement**: System must reject certificates with duplicate IDs
- Check existence before issuing
- Return clear error message

**Priority**: High
**Acceptance Criteria**:
- Transaction reverts if certificate ID exists
- Error message: "Certificate already exists"

#### FR-CI-004: Store Certificate Data
**Requirement**: Certificate data must be stored immutably
- On-chain: ID, issuer, student, IPFS hash, timestamp, revocation status
- Off-chain (IPFS): Complete certificate details

**Priority**: Critical
**Acceptance Criteria**:
- Data cannot be modified after issuance
- IPFS data is pinned for persistence
- All required fields are validated

### 2.3 Certificate Verification

#### FR-CV-001: Verify Certificate by ID
**Requirement**: Anyone must be able to verify a certificate using its ID
- Input: Certificate ID (bytes32)
- Output: Certificate status and details

**Priority**: Critical
**Acceptance Criteria**:
- Returns whether certificate exists
- Returns whether certificate is valid (not revoked)
- Returns issuer address
- Returns student address
- Returns issue timestamp
- Returns IPFS hash for full details
- No gas cost (view function)

#### FR-CV-002: Check Revocation Status
**Requirement**: Verification must indicate if certificate is revoked
- Display revocation status clearly
- Show revocation timestamp if applicable

**Priority**: High
**Acceptance Criteria**:
- Revoked certificates marked as invalid
- Verification clearly shows "Revoked" status
- Can still view original certificate data

#### FR-CV-003: Fetch Off-Chain Data
**Requirement**: System must retrieve full certificate details from IPFS
- Use IPFS hash from blockchain
- Display complete certificate information
- Handle IPFS retrieval errors gracefully

**Priority**: High
**Acceptance Criteria**:
- IPFS data fetched successfully
- Data displayed in user-friendly format
- Error handling for IPFS failures

### 2.4 Certificate Revocation

#### FR-CR-001: Revoke Certificate
**Requirement**: Registrars must be able to revoke certificates they issued
- Only issuer can revoke
- Must provide revocation reason
- Cannot revoke already-revoked certificates

**Priority**: High
**Acceptance Criteria**:
- Only certificate issuer can revoke
- Revocation sets `revoked` flag to true
- Revocation timestamp recorded
- `CertificateRevoked` event emitted with reason
- Revoked certificates fail verification

#### FR-CR-002: Prevent Unauthorized Revocation
**Requirement**: Non-issuers cannot revoke certificates
- Check issuer address
- Reject unauthorized revocation attempts

**Priority**: High
**Acceptance Criteria**:
- Transaction reverts if msg.sender != issuer
- Clear error message displayed

#### FR-CR-003: Prevent Double Revocation
**Requirement**: Cannot revoke an already-revoked certificate
- Check revocation status before revoking

**Priority**: Medium
**Acceptance Criteria**:
- Transaction reverts if already revoked
- Error message: "Already revoked"

### 2.5 Registrar Management

#### FR-RM-001: Add Registrar
**Requirement**: Admin must be able to add authorized registrar addresses
- Input: Ethereum address
- Validate address format

**Priority**: Critical
**Acceptance Criteria**:
- Only admin can add registrars
- Address validation performed
- `RegistrarAdded` event emitted
- Cannot add zero address
- Cannot add duplicate registrar

#### FR-RM-002: Remove Registrar
**Requirement**: Admin must be able to remove registrar access
- Input: Ethereum address
- Does not invalidate previously issued certificates

**Priority**: High
**Acceptance Criteria**:
- Only admin can remove registrars
- Removed registrar cannot issue new certificates
- Previous certificates remain valid
- `RegistrarRemoved` event emitted

#### FR-RM-003: Check Registrar Status
**Requirement**: System must allow checking if an address is a registrar
- Public view function
- Returns boolean

**Priority**: Medium
**Acceptance Criteria**:
- Function returns true/false correctly
- No gas cost

### 2.6 Emergency Controls

#### FR-EC-001: Pause Contract
**Requirement**: Admin must be able to pause critical functions
- Pauses certificate issuance
- Pauses revocation
- Verification remains active

**Priority**: High
**Acceptance Criteria**:
- Only admin can pause
- Paused state prevents issuance/revocation
- Verification still works when paused
- `Paused` event emitted

#### FR-EC-002: Unpause Contract
**Requirement**: Admin must be able to resume normal operations
- Restores all functions

**Priority**: High
**Acceptance Criteria**:
- Only admin can unpause
- All functions work after unpause
- `Unpaused` event emitted

---

## 3. Non-Functional Requirements

### 3.1 Security

#### NFR-SEC-001: Access Control
**Requirement**: All sensitive functions must be protected by appropriate access control
- Use modifiers for role checking
- No bypass mechanisms

**Priority**: Critical
**Standard**: OWASP Smart Contract Security

#### NFR-SEC-002: Immutability
**Requirement**: Certificate data must be immutable after issuance
- No update functions
- Only revocation flag can change

**Priority**: Critical

#### NFR-SEC-003: Audit Trail
**Requirement**: All state changes must emit events
- Complete transaction history via events
- Supports off-chain indexing

**Priority**: High

#### NFR-SEC-004: Private Key Security
**Requirement**: System must encourage secure key management
- Documentation on best practices
- Support for hardware wallets

**Priority**: High

### 3.2 Performance

#### NFR-PERF-001: Gas Efficiency
**Requirement**: Gas costs must be optimized
- Certificate issuance: <100,000 gas
- Verification: 0 gas (view function)
- Revocation: <50,000 gas

**Priority**: High
**Measurement**: Gas reporter in tests

#### NFR-PERF-002: Transaction Speed
**Requirement**: Transactions must complete within reasonable time
- Target: <2 minutes on Sepolia
- Depends on network congestion

**Priority**: Medium

#### NFR-PERF-003: Frontend Load Time
**Requirement**: Frontend must load quickly
- Initial load: <3 seconds
- Subsequent pages: <1 second

**Priority**: Medium

### 3.3 Reliability

#### NFR-REL-001: Smart Contract Stability
**Requirement**: Smart contract must be thoroughly tested
- Test coverage: >90%
- All edge cases covered
- No known bugs at deployment

**Priority**: Critical

#### NFR-REL-002: IPFS Data Persistence
**Requirement**: IPFS data must be persistently available
- Use pinning service
- 99.9% uptime target

**Priority**: High

#### NFR-REL-003: Network Resilience
**Requirement**: System must handle network issues gracefully
- Fallback RPC providers
- Retry mechanisms
- Clear error messages

**Priority**: High

### 3.4 Usability

#### NFR-USE-001: Intuitive Interface
**Requirement**: UI must be user-friendly
- Clear navigation
- Helpful tooltips
- Minimal clicks to complete tasks

**Priority**: High
**Validation**: User testing

#### NFR-USE-002: Error Messages
**Requirement**: Error messages must be clear and actionable
- No technical jargon for end users
- Suggest solutions when possible

**Priority**: High

#### NFR-USE-003: Responsive Design
**Requirement**: UI must work on different screen sizes
- Desktop: ≥1024px
- Tablet: ≥768px  
- Mobile: ≥375px

**Priority**: Medium

#### NFR-USE-004: Accessibility
**Requirement**: Interface must be accessible
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

**Priority**: Medium

### 3.5 Maintainability

#### NFR-MAIN-001: Code Quality
**Requirement**: Code must be well-structured and documented
- NatSpec for all contract functions
- Comments for complex logic
- Consistent style guide

**Priority**: High

#### NFR-MAIN-002: Documentation
**Requirement**: Comprehensive documentation must be maintained
- README with setup instructions
- Architecture documentation
- User guides
- API documentation

**Priority**: High

#### NFR-MAIN-003: Version Control
**Requirement**: All code must be version controlled
- Git with meaningful commits
- Branch strategy for features
- Tagged releases

**Priority**: High

### 3.6 Scalability

#### NFR-SCALE-001: Certificate Volume
**Requirement**: System must handle growing number of certificates
- No performance degradation with volume
- Efficient data structures (mappings, not arrays)

**Priority**: High

#### NFR-SCALE-002: Multiple Institutions
**Requirement**: System must support multiple institutions/registrars
- No limit on number of registrars
- Each registrar operates independently

**Priority**: Medium

### 3.7 Compatibility

#### NFR-COMP-001: Browser Support
**Requirement**: Support modern browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Priority**: High

#### NFR-COMP-002: MetaMask Compatibility
**Requirement**: Full MetaMask integration
- Connect wallet
- Sign transactions
- Network switching
- Account switching

**Priority**: Critical

#### NFR-COMP-003: Mobile Wallet Support
**Requirement**: Work with MetaMask mobile (future)
- Responsive design
- Mobile-optimized flows

**Priority**: Low (future enhancement)

---

## 4. Technical Requirements

### 4.1 Smart Contract

#### TR-SC-001: Solidity Version
**Requirement**: Use Solidity 0.8.x
- Built-in overflow checks
- Latest security features

**Priority**: Critical

#### TR-SC-002: OpenZeppelin Libraries
**Requirement**: Use OpenZeppelin contracts where applicable
- Tested, audited code
- Industry standard

**Priority**: High

#### TR-SC-003: Contract Size
**Requirement**: Contract must be deployable
- Must fit within 24KB limit
- Optimize if necessary

**Priority**: High

### 4.2 Frontend

#### TR-FE-001: React Version
**Requirement**: Use React 18+
- Modern hooks
- Concurrent features

**Priority**: High

#### TR-FE-002: Web3 Library
**Requirement**: Use ethers.js v6
- Type safety
- Modern API

**Priority**: High

#### TR-FE-003: Build Tool
**Requirement**: Use modern build tool
- Vite or Create React App
- Fast development experience

**Priority**: Medium

### 4.3 Testing

#### TR-TEST-001: Unit Tests
**Requirement**: Comprehensive unit tests for smart contracts
- Test all functions
- Test all access controls
- Test edge cases
- Test failure scenarios

**Priority**: Critical

#### TR-TEST-002: Integration Tests
**Requirement**: Test frontend-contract integration
- Happy paths
- Error scenarios
- MetaMask interactions

**Priority**: High

#### TR-TEST-003: Test Coverage
**Requirement**: Achieve high test coverage
- Target: >90% for contracts
- Measure with coverage tools

**Priority**: High

### 4.4 Deployment

#### TR-DEPLOY-001: Network Configuration
**Requirement**: Support multiple networks in configuration
- Local (Ganache)
- Sepolia testnet
- Mainnet (optional)

**Priority**: High

#### TR-DEPLOY-002: Environment Variables
**Requirement**: Use environment variables for sensitive data
- API keys
- Private keys
- Configuration

**Priority**: Critical

#### TR-DEPLOY-003: Contract Verification
**Requirement**: Verify contract on Etherscan
- Open source verification
- Transparency

**Priority**: High

---

## 5. Data Requirements

### 5.1 On-Chain Data

#### DR-ON-001: Certificate Storage
**Requirement**: Store essential certificate data on blockchain
- Certificate ID (bytes32)
- Issuer address
- Student address
- IPFS hash
- Issue timestamp
- Revocation flag
- Revocation timestamp

**Priority**: Critical

#### DR-ON-002: Registrar Mapping
**Requirement**: Store registrar authorization on-chain
- Address to boolean mapping
- Admin address

**Priority**: Critical

### 5.2 Off-Chain Data

#### DR-OFF-001: IPFS Storage
**Requirement**: Store detailed certificate data on IPFS
- Student details
- Course information
- Institution details
- Metadata
- Optional: certificate image/PDF

**Priority**: High

#### DR-OFF-002: Data Format
**Requirement**: Use JSON format for IPFS data
- Structured, versioned format
- Human-readable
- Extensible

**Priority**: High

---

## 6. Integration Requirements

### 6.1 MetaMask

#### IR-MM-001: Wallet Connection
**Requirement**: Enable MetaMask wallet connection
- Request account access
- Handle connection errors
- Detect account changes

**Priority**: Critical

#### IR-MM-002: Network Validation
**Requirement**: Validate user is on correct network
- Check chain ID
- Prompt network switch if needed
- Block transactions on wrong network

**Priority**: Critical

### 6.2 IPFS

#### IR-IPFS-001: Upload Functionality
**Requirement**: Upload certificate data to IPFS
- Via Pinata API
- Return IPFS hash
- Handle upload errors

**Priority**: Critical

#### IR-IPFS-002: Retrieval Functionality
**Requirement**: Retrieve certificate data from IPFS
- Via IPFS gateway
- Handle retrieval errors
- Timeout handling

**Priority**: Critical

### 6.3 RPC Providers

#### IR-RPC-001: Primary Provider
**Requirement**: Configure primary RPC provider
- Infura or Alchemy
- API key management

**Priority**: Critical

#### IR-RPC-002: Fallback Providers
**Requirement**: Configure fallback RPC providers
- Public Sepolia RPCs
- Automatic failover

**Priority**: High

---

## 7. Compliance Requirements

### 7.1 Data Privacy

#### CR-DP-001: Minimal Data Storage
**Requirement**: Store minimal personal data on blockchain
- Only necessary for verification
- Sensitive data off-chain

**Priority**: High

#### CR-DP-002: Right to Privacy
**Requirement**: Respect user privacy
- No unnecessary data collection
- Clear privacy policy

**Priority**: Medium

### 7.2 Legal

#### CR-LEG-001: Terms of Service
**Requirement**: Provide clear terms of service
- Liability disclaimer
- Usage terms

**Priority**: Medium

#### CR-LEG-002: Institution Verification
**Requirement**: Process for verifying institution legitimacy
- Admin vets institutions
- Documentation required

**Priority**: Medium

---

## 8. Documentation Requirements

### 8.1 Technical Documentation

#### DOC-TECH-001: README
**Requirement**: Comprehensive README file
- Project overview
- Setup instructions
- Usage examples

**Priority**: Critical

#### DOC-TECH-002: Architecture Docs
**Requirement**: Detailed architecture documentation
- System design
- Data flow
- Component interaction

**Priority**: High

#### DOC-TECH-003: API Documentation
**Requirement**: Document all smart contract functions
- NatSpec comments
- Parameter descriptions
- Return values

**Priority**: High

### 8.2 User Documentation

#### DOC-USER-001: User Guide
**Requirement**: Step-by-step user guide
- For registrars
- For verifiers
- With screenshots

**Priority**: High

#### DOC-USER-002: FAQ
**Requirement**: Frequently Asked Questions document
- Common issues
- Troubleshooting

**Priority**: Medium

---

## 9. Testing Requirements

### 9.1 Test Cases

#### TEST-001: Access Control Tests
- Admin can add/remove registrars
- Non-admin cannot add/remove registrars
- Registrar can issue certificates
- Non-registrar cannot issue certificates
- Only issuer can revoke their certificates

#### TEST-002: Certificate Issuance Tests
- Successfully issue certificate with valid data
- Reject duplicate certificate ID
- Reject invalid student address
- Emit CertificateIssued event
- Increment certificate count

#### TEST-003: Verification Tests
- Verify existing certificate returns correct data
- Verify non-existent certificate returns false
- Verify revoked certificate shows revoked status
- Verification is read-only (no gas cost)

#### TEST-004: Revocation Tests
- Successfully revoke certificate
- Prevent unauthorized revocation
- Prevent double revocation
- Emit CertificateRevoked event

#### TEST-005: Emergency Tests
- Admin can pause contract
- Cannot issue certificates when paused
- Can verify when paused
- Admin can unpause contract

---

## 10. Success Criteria

### 10.1 MVP Success Criteria

- [ ] Smart contract deploys successfully to Sepolia
- [ ] Admin can add registrars
- [ ] Registrars can issue certificates
- [ ] Anyone can verify certificates
- [ ] Registrars can revoke certificates
- [ ] All tests pass with >90% coverage
- [ ] Frontend connects to MetaMask
- [ ] IPFS integration works
- [ ] Documentation is complete
- [ ] Demo can be performed successfully

### 10.2 Quality Metrics

- **Test Coverage**: >90%
- **Gas Efficiency**: <100,000 per certificate
- **Transaction Success Rate**: >99%
- **Documentation Completeness**: 100%
- **Security Issues**: 0 critical, 0 high

---

## 11. Out of Scope (Future Enhancements)

The following are NOT required for MVP but may be added later:

- [ ] NFT certificates (ERC-721)
- [ ] Multi-chain support
- [ ] Batch certificate issuance
- [ ] Advanced search/filtering
- [ ] Email notifications
- [ ] Mobile app
- [ ] QR code generation
- [ ] Certificate templates
- [ ] Payment integration
- [ ] Governance token
- [ ] DAO features
- [ ] Zero-knowledge proofs

---

## Conclusion

This requirements document provides a comprehensive specification for the Transcript Verification DApp. All requirements are categorized by priority:

- **Critical**: Must have for MVP
- **High**: Should have for MVP
- **Medium**: Nice to have
- **Low**: Future enhancement

Requirements will be tracked throughout development and checked off as completed.
