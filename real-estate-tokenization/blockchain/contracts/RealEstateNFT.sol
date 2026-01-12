// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RealEstate is ERC721URIStorage, Ownable, ReentrancyGuard {
    
    uint256 public nextPropertyId;

    struct Property {
        uint256 id;
        uint256 pricePerShare; // In Wei (1 MATIC = 10^18 Wei)
        uint256 totalShares;
        uint256 sharesSold;
        address owner; // The Admin/Seller
        bool isActive;
    }

    // propertyId => Property Details
    mapping(uint256 => Property) public properties;
    
    // propertyId => (User Address => Shares Owned)
    mapping(uint256 => mapping(address => uint256)) public userShares;

    event PropertyListed(uint256 indexed id, address indexed owner, uint256 pricePerShare, uint256 totalShares);
    event SharesPurchased(uint256 indexed id, address indexed buyer, uint256 shares, uint256 amountSpent);

    constructor() ERC721("RealEstateToken", "RET") Ownable(msg.sender) {}

    // ADMIN: List a new property
    function listProperty(
        uint256 _pricePerShare,
        uint256 _totalShares,
        string memory _tokenURI
    ) external onlyOwner {
        uint256 currentId = nextPropertyId;

        // 1. Mint NFT to Admin
        _mint(msg.sender, currentId);
        _setTokenURI(currentId, _tokenURI);

        // 2. Create Share Rules
        properties[currentId] = Property({
            id: currentId,
            pricePerShare: _pricePerShare,
            totalShares: _totalShares,
            sharesSold: 0,
            owner: msg.sender,
            isActive: true
        });

        emit PropertyListed(currentId, msg.sender, _pricePerShare, _totalShares);
        nextPropertyId++;
    }

    // USER: Buy Shares
    function buyShares(uint256 _propertyId, uint256 _sharesToBuy) external payable nonReentrant {
        Property storage property = properties[_propertyId];

        require(property.isActive, "Property not active");
        require(property.sharesSold + _sharesToBuy <= property.totalShares, "Sold out");
        
        uint256 totalCost = property.pricePerShare * _sharesToBuy;
        require(msg.value >= totalCost, "Insufficient MATIC");

        // 3. Send MATIC to Admin
        (bool success, ) = payable(property.owner).call{value: totalCost}("");
        require(success, "Transfer failed");

        // 4. Record Shares
        property.sharesSold += _sharesToBuy;
        userShares[_propertyId][msg.sender] += _sharesToBuy;

        emit SharesPurchased(_propertyId, msg.sender, _sharesToBuy, totalCost);
    }
}