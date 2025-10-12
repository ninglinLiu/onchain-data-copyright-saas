// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IBodhi.sol";
import "./ERC721.sol";
// bodhi address: 0x2ad82a4e39bac43a54ddfe6f94980aaf0d1409ef

contract ProtocolNFT is ERC721 {
    // Events
    event ProtocolCreated(uint256 indexed protocolId, string name, string link);

    // Protocol metadata
    mapping(uint256 => string) private _names;
    mapping(uint256 => string) private _tokenURI;
    mapping(uint256 => uint256) private _bodhi_ids;
    // The link could be a link to the bodhi asset, link to the arweave asset, or any link else to the content.
    mapping(uint256 => string) private _cotent_links;
    uint256 private _nextTokenId;

    constructor() ERC721("Protocol", "PRTCL") {
        _nextTokenId = 1;
    }

    // if bodhi_id is 0, then the protocol is not bodhi based
    function mint(address to, string memory name, string memory uri, string memory link, uint256 bodhi_id) external returns (uint256) {
        require(bytes(name).length > 0, "Empty name");
        uint256 tokenId = _nextTokenId++;
        _names[tokenId] = name;
        _tokenURI[tokenId] = uri;
        _cotent_links[tokenId] = link;
        _bodhi_ids[tokenId] = bodhi_id;
        _mint(to, tokenId);
        emit ProtocolCreated(tokenId, name, link);
        return tokenId;
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        require(_ownerOf[id] != address(0), "Token does not exist");
        return _tokenURI[id];
    }



    function getProtocolInfo(uint256 tokenId) external view returns (string memory name, string memory uri,string memory link, uint256 bodhi_id) {
        require(_ownerOf[tokenId] != address(0), "Token does not exist");
        return (_names[tokenId], _tokenURI[tokenId], _cotent_links[tokenId], _bodhi_ids[tokenId]);
    }
}

contract CopyrightNFT is ERC721 {
    // Events
    event CopyrightCreated(uint256 indexed copyrightId, bytes32 contentHash, string name, uint256 protocolId, string data_link, uint256 bodhi_id);

    // Copyright metadata
    struct CopyrightMetadata {
        bytes32 contentHash;
        string name;
        uint256 protocolId;
        string data_link;
        uint256 bodhi_id;
    }

    mapping(uint256 => CopyrightMetadata) private _metadata;
    mapping(uint256 => string) private _tokenURI;
    uint256 private _nextTokenId;
    ProtocolNFT public immutable protocolContract;
    IBodhi public immutable bodhi;

    constructor(address _protocolContract, address _bodhiAddress) ERC721("Copyright", "CPYRT") {
        protocolContract = ProtocolNFT(_protocolContract);
        bodhi = IBodhi(_bodhiAddress);
        _nextTokenId = 1;
    }

    // if bodhi_id is 0, then the copyright is not bodhi based
    function mint(
        address to,
        string memory uri,
        bytes32 contentHash,
        string memory name,
        uint256 protocolId,
        string memory link,
        uint256 bodhi_id
    ) external returns (uint256) {
        require(contentHash != bytes32(0), "Empty hash");
        require(address(protocolContract).code.length > 0, "Protocol contract not deployed");
        require(protocolContract.ownerOf(protocolId) != address(0), "Protocol does not exist");
        uint256 tokenId = _nextTokenId++;
        _metadata[tokenId] = CopyrightMetadata({
            contentHash: contentHash,
            name: name,
            protocolId: protocolId,
            data_link: link,
            bodhi_id: bodhi_id
        });

        _tokenURI[tokenId] = uri;
        _mint(to, tokenId);
        emit CopyrightCreated(tokenId, contentHash, name, protocolId, link, bodhi_id);
        return tokenId;
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        require(_ownerOf[id] != address(0), "Token does not exist");
        return _tokenURI[id];
    }

    function getCopyrightInfo(uint256 tokenId) external view returns (
        bytes32 contentHash,
        string memory name,
        uint256 protocolId,
        string memory data_link,
        uint256 bodhi_id
    ) {
        require(_ownerOf[tokenId] != address(0), "Token does not exist");
        CopyrightMetadata memory metadata = _metadata[tokenId];
        return (
            metadata.contentHash,
            metadata.name,
            metadata.protocolId,
            metadata.data_link,
            metadata.bodhi_id
        );
    }
}

contract BodhiBasedCopyright {
    ProtocolNFT public immutable protocolNFT;
    CopyrightNFT public immutable copyrightNFT;
    

    constructor() {
        // Deploy the Protocol NFT contract
        protocolNFT = new ProtocolNFT();
        
        // Deploy the Copyright NFT contract with Protocol NFT address and Bodhi address
        copyrightNFT = new CopyrightNFT(
            address(protocolNFT),
            0x2AD82A4E39Bac43A54DdfE6f94980AAf0D1409eF // Bodhi address
        );
    }

    /**
     * @dev Generate a new protocol NFT
     * @param _name Name of the protocol
     * @param _link Link to the protocol documentation
     * @return protocolId The ID of the newly created protocol NFT
     */
    function generateProtocol(
        string calldata _name,
        string calldata _uri,
        string calldata _link,
        uint256 _bodhiId
    ) external returns (uint256) {
        return protocolNFT.mint(msg.sender, _name, _uri, _link, _bodhiId);
    }

    /**
     * @dev Generate a new copyright NFT
     * @param _contentHash Hash of the content
     * @param _name Name of the content (optional)
     * @param _protocolId ID of the protocol to use
     * @param _link Link to the content (optional)
     * @param _bodhiId The Bodhi asset ID (0 if not Bodhi-based)
     * @return copyrightId The ID of the newly created copyright NFT
     */
    function generateCopyright(
        bytes32 _contentHash,
        string calldata _name,
        uint256 _protocolId,
        string calldata _uri,
        string calldata _link,
        uint256 _bodhiId
    ) external returns (uint256) {
        return copyrightNFT.mint(msg.sender, _uri, _contentHash, _name, _protocolId, _link, _bodhiId);
    }

    /**
     * @dev Get protocol information
     * @param _protocolId The ID of the protocol to query
     * @return name The name of the protocol
     * @return uri The token URI
     * @return link The link to the protocol documentation
     */
    function getProtocol(uint256 _protocolId) external view returns (string memory name, string memory uri, string memory link, uint256 bodhi_id) {
        (name, uri, link, bodhi_id) = protocolNFT.getProtocolInfo(_protocolId);
    }

    /**
     * @dev Get copyright information
     * @param _copyrightId The ID of the copyright to query
     * @return contentHash The hash of the content
     * @return name The name of the content
     * @return protocolId The ID of the protocol used
     * @return link The link to the content
     * @return bodhi_id The Bodhi asset ID (0 if not Bodhi-based)
     */
    function getCopyright(uint256 _copyrightId) external view returns (
        bytes32 contentHash,
        string memory name,
        uint256 protocolId,
        string memory link,
        uint256 bodhi_id
    ) {
        return copyrightNFT.getCopyrightInfo(_copyrightId);
    }
}