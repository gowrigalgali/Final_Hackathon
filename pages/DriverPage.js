import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import GoogleMap from './GoogleMap';
import atm_abi from "../artifacts/contracts/CarPooling.sol/CarPooling.json";
import { ethers } from "ethers";
//import styles from '../styles/CarDetails.module.css'; // Import the CSS module

export default function CarDetails() {
    const [driver, setDriver] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [lp, setLp] = useState('');
    const [colour, setColour] = useState('');
    const [seats, setSeats] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');

    const router = useRouter();
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const atmABI = atm_abi.abi;

    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    const handleSubmit = (e) => {
        e.preventDefault();
        const carDetails = {
            driver,
            make,
            model,
            lp,
            colour,
            seats,
            source,
            destination,
        };
        console.log(carDetails);
        // Add your form submission logic here
    };

    return (
        <>
            <Head>
                <title>Car Details</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="boxcontainer">
                <div className="formContainer">
                    <h2>Enter Car Details</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Driver Address"
                            value={driver}
                            onChange={(e) => setDriver(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Make"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="License Plate"
                            value={lp}
                            onChange={(e) => setLp(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Colour"
                            value={colour}
                            onChange={(e) => setColour(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Seats"
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="mapContainer">
                    <GoogleMap />
                </div>
            </div>
        </>
    );
}
