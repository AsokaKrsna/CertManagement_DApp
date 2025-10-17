// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TranscriptVerification
 * @dev Simple contract for issuing and verifying academic certificates
 * @notice This is an academic project - simplified approach with Google Drive storage
 */
contract TranscriptVerification {
    
    // State variables
    address public admin;
    uint256 public certificateCount;
    
    // Mappings
    mapping(address => bool) public registrars;
    mapping(bytes32 => Certificate) public certificates;
    mapping(bytes32 => bool) public certificateExists;
    
    // Certificate structure
    struct Certificate {
        bytes32 certHash;           // Hash of the certificate file
        address issuer;             // Registrar who issued it
        address student;            // Student's address
        string driveLink;           // Google Drive link to certificate
        uint256 issueTimestamp;     // When it was issued
        bool revoked;               // Revocation status
        uint256 revocationTimestamp; // When it was revoked (if applicable)
    }
    
    // Events
    event RegistrarAdded(address indexed registrar, address indexed admin, uint256 timestamp);
    event RegistrarRemoved(address indexed registrar, address indexed admin, uint256 timestamp);
    event CertificateIssued(
        bytes32 indexed certHash, 
        address indexed student, 
        address indexed issuer, 
        uint256 timestamp
    );
    event CertificateRevoked(
        bytes32 indexed certHash, 
        address indexed issuer, 
        string reason, 
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRegistrar() {
        require(registrars[msg.sender], "Only registrar can perform this action");
        _;
    }
    
    /**
     * @dev Constructor - sets deployer as admin and first registrar
     */
    constructor() {
        admin = msg.sender;
        registrars[msg.sender] = true;
        emit RegistrarAdded(msg.sender, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Add a new registrar (only admin)
     * @param _registrar Address of the new registrar
     */
    function addRegistrar(address _registrar) public onlyAdmin {
        require(_registrar != address(0), "Invalid address");
        require(!registrars[_registrar], "Already a registrar");
        
        registrars[_registrar] = true;
        emit RegistrarAdded(_registrar, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Remove a registrar (only admin)
     * @param _registrar Address of the registrar to remove
     */
    function removeRegistrar(address _registrar) public onlyAdmin {
        require(registrars[_registrar], "Not a registrar");
        require(_registrar != admin, "Cannot remove admin");
        
        registrars[_registrar] = false;
        emit RegistrarRemoved(_registrar, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Issue a new certificate (only registrar)
     * @param _certHash Hash of the certificate file (calculated in frontend)
     * @param _studentAddress Address of the student
     * @param _driveLink Google Drive link to the certificate
     */
    function issueCertificate(
        bytes32 _certHash,
        address _studentAddress,
        string memory _driveLink
    ) public onlyRegistrar {
        require(_certHash != bytes32(0), "Invalid certificate hash");
        require(_studentAddress != address(0), "Invalid student address");
        require(bytes(_driveLink).length > 0, "Drive link required");
        require(!certificateExists[_certHash], "Certificate already exists");
        
        certificates[_certHash] = Certificate({
            certHash: _certHash,
            issuer: msg.sender,
            student: _studentAddress,
            driveLink: _driveLink,
            issueTimestamp: block.timestamp,
            revoked: false,
            revocationTimestamp: 0
        });
        
        certificateExists[_certHash] = true;
        certificateCount++;
        
        emit CertificateIssued(_certHash, _studentAddress, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify if a certificate is valid
     * @param _certHash Hash of the certificate to verify
     * @return valid Whether the certificate is valid (exists and not revoked)
     * @return cert The certificate data
     */
    function verifyCertificate(bytes32 _certHash) 
        public 
        view 
        returns (bool valid, Certificate memory cert) 
    {
        if (certificateExists[_certHash]) {
            cert = certificates[_certHash];
            valid = !cert.revoked;
        } else {
            valid = false;
        }
    }
    
    /**
     * @dev Get certificate details
     * @param _certHash Hash of the certificate
     * @return The certificate data
     */
    function getCertificate(bytes32 _certHash) 
        public 
        view 
        returns (Certificate memory) 
    {
        require(certificateExists[_certHash], "Certificate does not exist");
        return certificates[_certHash];
    }
    
    /**
     * @dev Revoke a certificate (only the issuer can revoke)
     * @param _certHash Hash of the certificate to revoke
     * @param _reason Reason for revocation
     */
    function revokeCertificate(bytes32 _certHash, string memory _reason) 
        public 
        onlyRegistrar 
    {
        require(certificateExists[_certHash], "Certificate does not exist");
        require(certificates[_certHash].issuer == msg.sender, "Only issuer can revoke");
        require(!certificates[_certHash].revoked, "Already revoked");
        
        certificates[_certHash].revoked = true;
        certificates[_certHash].revocationTimestamp = block.timestamp;
        
        emit CertificateRevoked(_certHash, msg.sender, _reason, block.timestamp);
    }
    
    /**
     * @dev Check if an address is a registrar
     * @param _address Address to check
     * @return bool Whether the address is a registrar
     */
    function isRegistrar(address _address) public view returns (bool) {
        return registrars[_address];
    }
    
    /**
     * @dev Get total number of certificates issued
     * @return uint256 Total certificate count
     */
    function getTotalCertificates() public view returns (uint256) {
        return certificateCount;
    }
}
