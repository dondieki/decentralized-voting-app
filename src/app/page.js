"use client";

import { useEffect, useState } from "react";
import Web3 from "web3";
import "./globals.css";

const ADDRESS = "0x0fC5025C764cE34df352757e82f7B5c4Df39A836";
const ABI = [];

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Initialize contract and load proposals
      const contractInstance = new web3Instance.eth.Contract(ABI, ADDRESS);
      setContract(contractInstance);

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
        });
    } else {
      alert("Please install MetaMask to use this DApp!");
    }
  }, []);

  const loadProposals = async () => {
    const proposalsCount = await contract.methods.getProposalsCount().call();
    const proposalsArray = [];

    for (let i = 0; i < proposalsCount; i++) {
      const proposal = await contract.methods.getProposal(i).call();
      proposalsArray.push({ ...proposal, id: i });
    }
    setProposals(proposalsArray);
  };

  const handleCreateProposal = async () => {
    await contract.methods.createProposal(newProposal).send({ from: account });
    loadProposals();
  };

  const handleVote = async (proposalId, support) => {
    await contract.methods.vote(proposalId, support).send({ from: account });
    loadProposals();
  };

  return (
    <div className="px-16 py-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Decentralized Voting App</h1>

        <div className="flex flex-col gap-4">
          <h2 className="underline font-medium">Create a New Proposal</h2>
          <input
            type="text"
            value={newProposal}
            className="border w-72 py-3 px-4"
            onChange={(e) => setNewProposal(e.target.value)}
            placeholder="Proposal Description"
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 py-3 px-4 text-white w-40 rounded-md"
            onClick={handleCreateProposal}
          >
            Create Proposal
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="underline font-medium">Proposals</h2>
          {proposals.length === 0 ? (
            <p>No proposals found.</p>
          ) : (
            proposals.map((proposal, index) => (
              <div key={index} className="proposal">
                <p>{proposal.description}</p>
                <p>Votes For: {proposal.votesFor}</p>
                <p>Votes Against: {proposal.votesAgainst}</p>
                <button onClick={() => handleVote(proposal.id, true)}>
                  Vote For
                </button>
                <button onClick={() => handleVote(proposal.id, false)}>
                  Vote Against
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
