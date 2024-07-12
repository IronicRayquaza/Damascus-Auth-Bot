// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Authorization {
    mapping(address => bool) public authorized;

    function authorize(address user) public {
        authorized[user] = true;
    }

    function isAuthorized(address user) public view returns (bool) {
        return authorized[user];
    }
}
