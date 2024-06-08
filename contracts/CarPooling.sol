// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract CarPooling {
    struct Member {
        uint id;
        address userAddress;
        string username;
        string passwordHash;
    }

    struct CarDetails {
        address driver;
        string make;
        string model;
        string lp; // License plate
        string colour;
        uint seats;
        string source;
        string destination;
    }
    struct Route {
        string location;
        string destination;
        string[] stops;
    }

    Route[] public routes;

    function addRoute(string memory location, string memory destination, string[] memory stops) public {
        routes.push(Route(location, destination, stops));
    }

    function getRoutes(string memory location, string memory destination) public view returns (string[] memory) {
        for (uint i = 0; i < routes.length; i++) {
            if (keccak256(abi.encodePacked(routes[i].location)) == keccak256(abi.encodePacked(location)) &&
                keccak256(abi.encodePacked(routes[i].destination)) == keccak256(abi.encodePacked(destination))) {
                return routes[i].stops;
            }
        }
        string[] memory empty;
        return empty;
    }
    mapping(address => Member) public users;
    mapping(string => address) private usernameToAddress;
    mapping(address => CarDetails) public carDetails;
    mapping(string => address[]) public routeToCars;

    function register(uint256 _id, address _userAddress, string memory _username, string memory _passwordHash) public {
        require(users[_userAddress].userAddress == address(0), "User already exists");
        require(usernameToAddress[_username] == address(0), "Username already taken");

        users[_userAddress] = Member({
            id: _id, 
            userAddress: _userAddress,
            username: _username,
            passwordHash: _passwordHash
        });

        usernameToAddress[_username] = _userAddress;
    }

    function authenticate(string memory _username, string memory _passwordHash) public view returns (bool) {
        address userAddress = usernameToAddress[_username];
        if (userAddress == address(0)) {
            return false;
        }
        Member memory user = users[userAddress];
        return keccak256(abi.encodePacked(user.passwordHash)) == keccak256(abi.encodePacked(_passwordHash));
    }

    function storeCarDetails(
        address _driver, 
        string memory _make, 
        string memory _model, 
        string memory _lp, 
        string memory _colour, 
        uint _seats, 
        string memory _source, 
        string memory _destination
    ) public {
        require(users[_driver].userAddress != address(0), "Driver not registered");

        carDetails[_driver] = CarDetails({
            driver: _driver,
            make: _make,
            model: _model,
            lp: _lp,
            colour: _colour,
            seats: _seats,
            source: _source,
            destination: _destination
        });

        routeToCars[string(abi.encodePacked(_source, ":", _destination))].push(_driver);
    }

    function getCarsByRoute(string memory _source, string memory _destination) public view returns (address[] memory) {
        return routeToCars[string(abi.encodePacked(_source, ":", _destination))];
    }
}
