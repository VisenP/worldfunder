// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ByteHasher } from './helpers/ByteHasher.sol';
import { IWorldID } from './interfaces/IWorldID.sol';

contract Contract {
	using ByteHasher for bytes;

	///////////////////////////////////////////////////////////////////////////////
	///                                  ERRORS                                ///
	//////////////////////////////////////////////////////////////////////////////

	/// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

	/// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal immutable worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal immutable externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable groupId = 1;

	/// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
	mapping(uint256 => bool) internal nullifierHashes;

	mapping(address => uint256) public votes;
	mapping(address => uint256) public projectIndexesByAddress;
	mapping(address => uint256) public contributions;
	mapping(address => uint256) public funderIndexesByAddress;


	struct Project {
		address payable addr;
		string name;
		string description;
		string img;
		string link;
		string catagory;
		uint256 votes;
	}

	struct Funder {
		address addr;
		uint256 totalValue;
	}

	Project[] projects;
	Funder[] funders;
	
	uint256 public totalVotes;

	function getBalance() public view returns (uint256) {
		return address(this).balance;
	}

	function getTotalVotes() public view returns (uint256) {
		return totalVotes;
	}

	function getVotes(address addr) public view returns (uint256) {
		return votes[addr];
	}

	function addProject(string memory name, string memory description, string memory img, string memory link, string memory catagory) public {
		uint256 idx = projectIndexesByAddress[msg.sender];
		if(idx != 0) {
			uint256 index = idx - 1;
			projects[index].addr = payable(msg.sender);
			projects[index].name = name;
			projects[index].description = description;
			projects[index].img = img;
			projects[index].link = link;
			projects[index].catagory = catagory;
			return;
		}

		Project memory project = Project(payable(msg.sender), name, description, img, link, catagory, 0);
		projects.push(project);
		projectIndexesByAddress[msg.sender] = projects.length;

	}

	function getProjects() public view returns (Project[] memory) {
		return projects;
	}

	function getFunders() public view returns (Funder[] memory) {
		return funders;
	}

	/// @param _worldId The WorldID instance that will verify the proofs
	/// @param _appId The World ID app ID
	/// @param _actionId The World ID action ID
	constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
		worldId = _worldId;
		externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
	}

	receive() external payable {
		uint256 idx = funderIndexesByAddress[msg.sender];
		if(idx != 0) {
			funders[idx - 1].totalValue += msg.value;
			return;
		}

		Funder memory funder = Funder(msg.sender, msg.value);
		funders.push(funder);
		funderIndexesByAddress[msg.sender] = funders.length;
	}

	/// @param signal Voting address
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	/// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
	function vote(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

		// We now verify the provided proof is valid and the user is verified by World ID
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);

		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		nullifierHashes[nullifierHash] = true;

		projects[projectIndexesByAddress[signal] - 1].votes++;
		totalVotes++;

	}

	function payout() public {
		uint256 balance = getBalance();

		for (uint256 i = 0; i < projects.length; i++) {
			Project memory project = projects[i];

			uint256 toPay = (balance * project.votes) / totalVotes;
			project.addr.transfer(toPay);
		}
	}
}
