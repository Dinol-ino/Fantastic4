// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RealEstateMarketplace (Optimized)
 * @dev Minimal version for hackathon deployment - saves gas
 */
contract RealEstateMarketplace is Ownable, ReentrancyGuard {
    
    uint256 public nextPropertyId;
    uint256 public nextListingId;

    struct Property {
        uint256 pricePerShare;      // Initial & current price
        uint256 totalShares;
        uint256 sharesSold;
        address owner;
        bool isActive;
    }
    
    struct ResaleListing {
        uint256 propertyId;
        address seller;
        uint256 shares;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => mapping(address => uint256)) public userShares;
    mapping(uint256 => ResaleListing) public resaleListings;
    mapping(uint256 => uint256) public lastResalePrice;

    event PropertyListed(uint256 indexed id, address owner, uint256 price, uint256 shares);
    event SharesPurchased(uint256 indexed id, address buyer, uint256 shares, uint256 cost);
    event ResaleCreated(uint256 indexed listingId, uint256 propertyId, uint256 shares, uint256 price);
    event ResaleSold(uint256 indexed listingId, address buyer, uint256 shares, uint256 newPrice);

    constructor() Ownable(msg.sender) {}

    // Admin lists property
    function listProperty(uint256 _price, uint256 _shares) external onlyOwner {
        properties[nextPropertyId] = Property(_price, _shares, 0, msg.sender, true);
        emit PropertyListed(nextPropertyId, msg.sender, _price, _shares);
        nextPropertyId++;
    }

    // Buy from primary listing
    function buyShares(uint256 _id, uint256 _amount) external payable nonReentrant {
        Property storage p = properties[_id];
        require(p.isActive && _amount > 0, "Invalid");
        require(_amount <= p.totalShares - p.sharesSold, "Not enough");
        require(msg.value >= _amount * p.pricePerShare, "Low payment");
        
        p.sharesSold += _amount;
        userShares[_id][msg.sender] += _amount;
        payable(p.owner).transfer(_amount * p.pricePerShare);
        
        if (msg.value > _amount * p.pricePerShare) {
            payable(msg.sender).transfer(msg.value - _amount * p.pricePerShare);
        }
        emit SharesPurchased(_id, msg.sender, _amount, _amount * p.pricePerShare);
    }

    // List shares for resale at custom price
    function listForResale(uint256 _propId, uint256 _shares, uint256 _price) external {
        require(userShares[_propId][msg.sender] >= _shares, "Not enough shares");
        userShares[_propId][msg.sender] -= _shares;
        
        resaleListings[nextListingId] = ResaleListing(_propId, msg.sender, _shares, _price, true);
        emit ResaleCreated(nextListingId, _propId, _shares, _price);
        nextListingId++;
    }

    // Buy from resale - UPDATES MARKET PRICE
    function buyResale(uint256 _listingId, uint256 _amount) external payable nonReentrant {
        ResaleListing storage l = resaleListings[_listingId];
        require(l.isActive && _amount <= l.shares, "Invalid");
        require(msg.value >= _amount * l.price, "Low payment");
        
        l.shares -= _amount;
        if (l.shares == 0) l.isActive = false;
        
        userShares[l.propertyId][msg.sender] += _amount;
        lastResalePrice[l.propertyId] = l.price; // Update market price!
        
        payable(l.seller).transfer(_amount * l.price);
        if (msg.value > _amount * l.price) {
            payable(msg.sender).transfer(msg.value - _amount * l.price);
        }
        emit ResaleSold(_listingId, msg.sender, _amount, l.price);
    }

    // Cancel resale listing
    function cancelResale(uint256 _id) external {
        ResaleListing storage l = resaleListings[_id];
        require(l.seller == msg.sender && l.isActive, "Cannot cancel");
        l.isActive = false;
        userShares[l.propertyId][msg.sender] += l.shares;
    }

    // Get current price (last resale or initial)
    function getPrice(uint256 _id) external view returns (uint256) {
        return lastResalePrice[_id] > 0 ? lastResalePrice[_id] : properties[_id].pricePerShare;
    }

    // Get implied market value
    function getMarketValue(uint256 _id) external view returns (uint256) {
        uint256 price = lastResalePrice[_id] > 0 ? lastResalePrice[_id] : properties[_id].pricePerShare;
        return price * properties[_id].totalShares;
    }
}