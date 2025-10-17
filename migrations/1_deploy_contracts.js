const TranscriptVerification = artifacts.require("TranscriptVerification");

module.exports = function (deployer) {
  deployer.deploy(TranscriptVerification);
};
