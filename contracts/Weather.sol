// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/ChainlinkClient.sol";

contract Weather is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public fee;
    
    event AvgTemp(uint256 _result);
    event TotalRain(uint256 _result);
    event Hail(uint256 _result);
    event ResultGeneric(uint256 _result);
    
    constructor(
        address _link,
        address _oracle,
        uint256 _fee
    ) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        fee = _fee;
    }
    
    function requestGeneric(
        string memory _geoJson,
        string memory _from,
        string memory _to,
        string memory _method,
        string memory _column,
        uint256 _times,
        bytes32 _jobId
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfillGeneric.selector
        );
        req.add("geoJson", _geoJson);
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", _method);
        req.add("column", _column);
        req.addUint("times", _times);
        req.add("units", "metric");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillGeneric(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        emit ResultGeneric(_result);
    }

    function requestAvgTemp(
        string memory _from,
        string memory _to,
        bytes32 _jobId
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfillAvgTemp.selector
        );
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", "AVG");
        req.add("column", "temp");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillAvgTemp(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        emit AvgTemp(_result);
    }
    
    function requestTotalRain(
        string memory _from,
        string memory _to,
        bytes32 _jobId
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfillTotalRain.selector
        );
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", "SUM");
        req.add("column", "prcp");
        req.add("units", "metric");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillTotalRain(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        emit TotalRain(_result);
    }
    
    function requestHail(
        string memory _from,
        string memory _to,
        bytes32 _jobId
    ) external {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfillHail.selector
        );
        req.add("dateFrom", _from);
        req.add("dateTo", _to);
        req.add("method", "SUM");
        req.add("column", "hail");
        req.add("units", "metric");
        sendChainlinkRequest(req, fee);
    }
    
    function fulfillHail(
        bytes32 _requestId,
        uint256 _result
    ) external recordChainlinkFulfillment(_requestId) {
        emit Hail(_result);
    }
}