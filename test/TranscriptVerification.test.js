const TranscriptVerification = artifacts.require("TranscriptVerification");
const { expect } = require("chai");

contract("TranscriptVerification", (accounts) => {
    let contract;
    const admin = accounts[0];
    const registrar1 = accounts[1];
    const registrar2 = accounts[2];
    const student1 = accounts[3];
    const student2 = accounts[4];
    const nonRegistrar = accounts[5];
    
    // Sample certificate data
    const certHash1 = web3.utils.keccak256("certificate1");
    const certHash2 = web3.utils.keccak256("certificate2");
    const driveLink1 = "https://drive.google.com/file/d/sample123";
    const driveLink2 = "https://drive.google.com/file/d/sample456";
    
    beforeEach(async () => {
        contract = await TranscriptVerification.new({ from: admin });
    });
    
    describe("Deployment", () => {
        it("should set the deployer as admin", async () => {
            const contractAdmin = await contract.admin();
            expect(contractAdmin).to.equal(admin);
        });
        
        it("should make admin a registrar by default", async () => {
            const isReg = await contract.isRegistrar(admin);
            expect(isReg).to.be.true;
        });
        
        it("should initialize certificate count to 0", async () => {
            const count = await contract.getTotalCertificates();
            expect(count.toNumber()).to.equal(0);
        });
    });
    
    describe("Registrar Management", () => {
        it("should allow admin to add registrar", async () => {
            await contract.addRegistrar(registrar1, { from: admin });
            const isReg = await contract.isRegistrar(registrar1);
            expect(isReg).to.be.true;
        });
        
        it("should emit RegistrarAdded event", async () => {
            const tx = await contract.addRegistrar(registrar1, { from: admin });
            expect(tx.logs[0].event).to.equal("RegistrarAdded");
            expect(tx.logs[0].args.registrar).to.equal(registrar1);
        });
        
        it("should not allow non-admin to add registrar", async () => {
            try {
                await contract.addRegistrar(registrar1, { from: nonRegistrar });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Only admin can perform this action");
            }
        });
        
        it("should not allow adding zero address as registrar", async () => {
            try {
                await contract.addRegistrar("0x0000000000000000000000000000000000000000", { from: admin });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Invalid address");
            }
        });
        
        it("should not allow adding duplicate registrar", async () => {
            await contract.addRegistrar(registrar1, { from: admin });
            try {
                await contract.addRegistrar(registrar1, { from: admin });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Already a registrar");
            }
        });
        
        it("should allow admin to remove registrar", async () => {
            await contract.addRegistrar(registrar1, { from: admin });
            await contract.removeRegistrar(registrar1, { from: admin });
            const isReg = await contract.isRegistrar(registrar1);
            expect(isReg).to.be.false;
        });
        
        it("should not allow removing admin as registrar", async () => {
            try {
                await contract.removeRegistrar(admin, { from: admin });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Cannot remove admin");
            }
        });
    });
    
    describe("Certificate Issuance", () => {
        beforeEach(async () => {
            await contract.addRegistrar(registrar1, { from: admin });
        });
        
        it("should allow registrar to issue certificate", async () => {
            await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
            
            const [valid, cert] = await contract.verifyCertificate(certHash1);
            expect(valid).to.be.true;
            expect(cert.student).to.equal(student1);
            expect(cert.issuer).to.equal(registrar1);
            expect(cert.driveLink).to.equal(driveLink1);
            expect(cert.revoked).to.be.false;
        });
        
        it("should emit CertificateIssued event", async () => {
            const tx = await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
            expect(tx.logs[0].event).to.equal("CertificateIssued");
            expect(tx.logs[0].args.certHash).to.equal(certHash1);
            expect(tx.logs[0].args.student).to.equal(student1);
            expect(tx.logs[0].args.issuer).to.equal(registrar1);
        });
        
        it("should increment certificate count", async () => {
            await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
            const count = await contract.getTotalCertificates();
            expect(count.toNumber()).to.equal(1);
            
            await contract.issueCertificate(certHash2, student2, driveLink2, { from: registrar1 });
            const count2 = await contract.getTotalCertificates();
            expect(count2.toNumber()).to.equal(2);
        });
        
        it("should not allow non-registrar to issue certificate", async () => {
            try {
                await contract.issueCertificate(certHash1, student1, driveLink1, { from: nonRegistrar });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Only registrar can perform this action");
            }
        });
        
        it("should not allow issuing certificate with zero hash", async () => {
            const zeroHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
            try {
                await contract.issueCertificate(zeroHash, student1, driveLink1, { from: registrar1 });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Invalid certificate hash");
            }
        });
        
        it("should not allow issuing certificate with zero address student", async () => {
            try {
                await contract.issueCertificate(
                    certHash1, 
                    "0x0000000000000000000000000000000000000000", 
                    driveLink1, 
                    { from: registrar1 }
                );
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Invalid student address");
            }
        });
        
        it("should not allow issuing certificate without drive link", async () => {
            try {
                await contract.issueCertificate(certHash1, student1, "", { from: registrar1 });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Drive link required");
            }
        });
        
        it("should not allow duplicate certificate hash", async () => {
            await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
            try {
                await contract.issueCertificate(certHash1, student2, driveLink2, { from: registrar1 });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Certificate already exists");
            }
        });
    });
    
    describe("Certificate Verification", () => {
        beforeEach(async () => {
            await contract.addRegistrar(registrar1, { from: admin });
            await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
        });
        
        it("should return true for valid certificate", async () => {
            const [valid, cert] = await contract.verifyCertificate(certHash1);
            expect(valid).to.be.true;
        });
        
        it("should return false for non-existent certificate", async () => {
            const fakeCertHash = web3.utils.keccak256("fakecertificate");
            const [valid, cert] = await contract.verifyCertificate(fakeCertHash);
            expect(valid).to.be.false;
        });
        
        it("should return certificate details", async () => {
            const cert = await contract.getCertificate(certHash1);
            expect(cert.student).to.equal(student1);
            expect(cert.issuer).to.equal(registrar1);
            expect(cert.driveLink).to.equal(driveLink1);
        });
        
        it("should revert when getting non-existent certificate", async () => {
            const fakeCertHash = web3.utils.keccak256("fakecertificate");
            try {
                await contract.getCertificate(fakeCertHash);
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Certificate does not exist");
            }
        });
    });
    
    describe("Certificate Revocation", () => {
        beforeEach(async () => {
            await contract.addRegistrar(registrar1, { from: admin });
            await contract.addRegistrar(registrar2, { from: admin });
            await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
        });
        
        it("should allow issuer to revoke certificate", async () => {
            await contract.revokeCertificate(certHash1, "Student request", { from: registrar1 });
            
            const [valid, cert] = await contract.verifyCertificate(certHash1);
            expect(valid).to.be.false;
            expect(cert.revoked).to.be.true;
        });
        
        it("should emit CertificateRevoked event", async () => {
            const tx = await contract.revokeCertificate(certHash1, "Error in certificate", { from: registrar1 });
            expect(tx.logs[0].event).to.equal("CertificateRevoked");
            expect(tx.logs[0].args.certHash).to.equal(certHash1);
            expect(tx.logs[0].args.reason).to.equal("Error in certificate");
        });
        
        it("should not allow non-issuer registrar to revoke", async () => {
            try {
                await contract.revokeCertificate(certHash1, "Reason", { from: registrar2 });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Only issuer can revoke");
            }
        });
        
        it("should not allow non-registrar to revoke", async () => {
            try {
                await contract.revokeCertificate(certHash1, "Reason", { from: nonRegistrar });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Only registrar can perform this action");
            }
        });
        
        it("should not allow revoking non-existent certificate", async () => {
            const fakeCertHash = web3.utils.keccak256("fakecertificate");
            try {
                await contract.revokeCertificate(fakeCertHash, "Reason", { from: registrar1 });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Certificate does not exist");
            }
        });
        
        it("should not allow revoking already revoked certificate", async () => {
            await contract.revokeCertificate(certHash1, "First revocation", { from: registrar1 });
            try {
                await contract.revokeCertificate(certHash1, "Second revocation", { from: registrar1 });
                expect.fail("Should have thrown an error");
            } catch (error) {
                expect(error.message).to.include("Already revoked");
            }
        });
    });
    
    describe("Helper Functions", () => {
        it("should check if address is registrar", async () => {
            expect(await contract.isRegistrar(admin)).to.be.true;
            expect(await contract.isRegistrar(nonRegistrar)).to.be.false;
            
            await contract.addRegistrar(registrar1, { from: admin });
            expect(await contract.isRegistrar(registrar1)).to.be.true;
        });
        
        it("should return total certificate count", async () => {
            await contract.addRegistrar(registrar1, { from: admin });
            
            expect((await contract.getTotalCertificates()).toNumber()).to.equal(0);
            
            await contract.issueCertificate(certHash1, student1, driveLink1, { from: registrar1 });
            expect((await contract.getTotalCertificates()).toNumber()).to.equal(1);
            
            await contract.issueCertificate(certHash2, student2, driveLink2, { from: registrar1 });
            expect((await contract.getTotalCertificates()).toNumber()).to.equal(2);
        });
    });
});
