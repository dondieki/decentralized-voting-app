// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) voted; // tracks whether an address has voted on this proposal
    }

    Proposal[] public proposals;

    // Function to create a new proposal
    function createProposal(string calldata _description) external {
        proposals.push();
        uint256 proposalIndex = proposals.length - 1;
        proposals[proposalIndex].description = _description;
    }

    // Function to vote on a proposal
    function vote(uint256 _proposalIndex, bool _support) external {
        Proposal storage proposal = proposals[_proposalIndex];
        require(!proposal.voted[msg.sender], "Already voted on this proposal");

        if (_support) {
            proposal.votesFor += 1;
        } else {
            proposal.votesAgainst += 1;
        }
        
        proposal.voted[msg.sender] = true; // mark this address as having voted on the proposal
    }

    // Function to get proposal details
    function getProposal(uint256 _proposalIndex) external view returns (string memory description, uint256 votesFor, uint256 votesAgainst) {
        Proposal storage proposal = proposals[_proposalIndex];
        return (proposal.description, proposal.votesFor, proposal.votesAgainst);
    }

    // Function to get the number of proposals
    function getProposalsCount() external view returns (uint256) {
        return proposals.length;
    }
}
