

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Head from 'next/head';
import atm_abi from '../artifacts/contracts/CarPooling.sol/CarPooling.json';

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Replace with your contract address

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('driver');
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const connectAccount = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                setAccount(accounts[0]);

                // Connect to the contract
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contractInstance = new ethers.Contract(contractAddress, atm_abi, signer);
                setContract(contractInstance);

                console.log('Account connected: ', accounts[0]);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/student/login', {
              username: username,
              password: password,
            });
            console.log('Response:', response.data);
            // Handle successful login response
            if (response.data.success && role === 'driver') {
              // If login is successful and role is student, set loggedIn to true
              setLoggedIn(true);
            }
          } catch (error) {
            console.error('Error:', error);
            if (error.response) {
              console.error('Response data:', error.response.data);
            }
            // Handle login failure
          }
        
            await connectAccount();
try{
            if (contract) {
                const passwordHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
                const authenticated = await contract.authenticate(username, passwordHash);

                if (authenticated) {
                    console.log('Login successful');
                    if (role === 'driver') {
                        router.push('./DriverPage');
                    } else {
                        router.push('./CommuterPage');
                    }
                } else {
                    console.log('Invalid username or password');
                }
            }
        } catch (error) {
            console.log('Error during login:', error);
        }
      }

    return (
        <>
            <Head>
                <title>Login/Signin Page</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="overlay"></div>
            <div className="container">
                <h2>Login/SignIn</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="driver">Driver</option>
                    <option value="commuter">Commuter</option>
                </select><br />
                <button onClick={handleLogin}>Login</button>
            </div>
        </>
    );
}