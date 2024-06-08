import React, { useState } from "react";
import Head from 'next/head';
import { ethers } from "ethers";
import GoogleMap from './GoogleMap';
import atm_abi from "../artifacts/contracts/CarPooling.sol/CarPooling.json";

export default function UserPage() {
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [results, setResults] = useState([]);
    const [amount, setAmount] = useState(''); // New state for amount
    const [owner, setOwner] = useState(''); // New state for owner

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
    const atmABI = atm_abi.abi;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/'); // Replace with your provider URL
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, atmABI, signer);

            // Call the smart contract function
            const routes = await contract.getRoutes(location, destination);

            // Assuming the function returns an array of routes
            setResults(routes);
        } catch (error) {
            console.error('There was a problem with the contract call:', error);
        }
    };

    const transferToOwner = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum)
                throw new Error("No crypto wallet found. Please install it.");
            
            await ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const tx = await signer.sendTransaction({
                to: owner,
                value: ethers.utils.parseEther(amount),
            });

            console.log({ amount, owner });
            console.log("tx", tx);
            console.log(`Transaction sent to ${owner} for ${amount} ETH`);
        } catch (err) {
            console.error("Error transferring ETH to owner:", err);
        }
    };

    return (
        <>
            <Head>
                <title>User Location</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="usercontainer">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
                <div className="resultsContainer">
                  
                    {results.map((result, index) => (
                        <div key={index} className="resultItem">
                            <p>{result}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Owner Address"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Amount in ETH"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <button onClick={transferToOwner}>Reached</button>
                </div>
                <div className="mapContainer">
                    <GoogleMap />
                </div>
            </div>
        </>
    );
}
