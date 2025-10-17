// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IBodhi.sol";

/**
 * @title LicenseExtension
 * @dev Extension contract for License management that integrates with Bodhi protocol
 * 
 * This contract extends the Bodhi protocol to provide license management capabilities
 * for datasets, allowing creators to define usage rights and terms.
 */
contract LicenseExtension {
    /// @dev Reference to the Bodhi protocol contract
    address public bodhiAddress;

    /**
     * @dev License types defining different usage permissions
     */
    enum LicenseType {
        ProhibitDerivatives,  // No derivatives allowed
        Open,                 // Fully open
        ShareBack5           // Open with 5% revenue sharing
    }

    /**
     * @dev License template structure
     */
    struct LicenseTemplate {
        uint256 id;
        string name;
        string uri;
        LicenseType licenseType;
        bool active;
    }

    /// @dev Mapping from dataset ID to license ID
    mapping(uint256 => uint256) public datasetLicense;

    /// @dev Mapping from license ID to LicenseTemplate
    mapping(uint256 => LicenseTemplate) public licenses;

    /// @dev Next license ID to be assigned
    uint256 public licenseIndex;

    /**
     * @dev Emitted when a license is bound to a dataset
     */
    event LicenseBound(uint256 indexed datasetId, uint256 indexed licenseId);

    /**
     * @dev Emitted when a new license template is created
     */
    event LicenseCreated(uint256 indexed licenseId, string name, LicenseType licenseType);

    /**
     * @dev Constructor sets the Bodhi protocol address
     * @param _bodhiAddress Address of the Bodhi protocol contract
     */
    constructor(address _bodhiAddress) {
        require(_bodhiAddress != address(0), "LicenseExtension: invalid Bodhi address");
        bodhiAddress = _bodhiAddress;
    }

    /**
     * @dev Creates a new license template
     * @param name Human-readable name for the license
     * @param licenseType Type of license
     * @param uri URI pointing to detailed license terms
     * @return id The unique identifier assigned to the license
     */
    function createLicense(
        string calldata name,
        LicenseType licenseType,
        string calldata uri
    ) external returns (uint256 id) {
        require(bytes(name).length > 0, "LicenseExtension: name cannot be empty");
        require(bytes(uri).length > 0, "LicenseExtension: uri cannot be empty");
        
        id = ++licenseIndex;
        
        licenses[id] = LicenseTemplate({
            id: id,
            name: name,
            uri: uri,
            licenseType: licenseType,
            active: true
        });
        
        emit LicenseCreated(id, name, licenseType);
    }

    /**
     * @dev Binds a license to a dataset (Bodhi asset)
     * @param datasetId The dataset identifier (maps to Bodhi asset ID)
     * @param licenseId The license identifier
     */
    function bindLicense(uint256 datasetId, uint256 licenseId) external {
        require(datasetId > 0, "LicenseExtension: invalid dataset ID");
        require(licenseId > 0 && licenseId <= licenseIndex, "LicenseExtension: invalid license ID");
        require(licenses[licenseId].active, "LicenseExtension: license is not active");
        
        // Verify the asset exists in Bodhi protocol
        if (bodhiAddress != address(0)) {
            (uint256 assetId, , ) = IBodhi(bodhiAddress).assets(datasetId);
            require(assetId > 0, "LicenseExtension: dataset does not exist in Bodhi");
        }
        
        // Store the binding
        datasetLicense[datasetId] = licenseId;
        
        emit LicenseBound(datasetId, licenseId);
    }

    /**
     * @dev Gets the license bound to a specific dataset
     * @param datasetId The dataset identifier
     * @return The LicenseTemplate struct for the dataset
     */
    function getLicenseOf(uint256 datasetId) external view returns (LicenseTemplate memory) {
        uint256 licenseId = datasetLicense[datasetId];
        require(licenseId > 0, "LicenseExtension: no license bound to dataset");
        
        return licenses[licenseId];
    }

    /**
     * @dev Checks if a dataset has a license bound to it
     * @param datasetId The dataset identifier
     * @return True if dataset has a license, false otherwise
     */
    function hasLicense(uint256 datasetId) external view returns (bool) {
        return datasetLicense[datasetId] > 0;
    }

    /**
     * @dev Updates the Bodhi protocol address
     * @param _bodhiAddress New Bodhi protocol address
     */
    function updateBodhiAddress(address _bodhiAddress) external {
        require(_bodhiAddress != address(0), "LicenseExtension: invalid Bodhi address");
        bodhiAddress = _bodhiAddress;
    }
}

