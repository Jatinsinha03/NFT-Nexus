import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login(props) {
    const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
    const [transform, setTransform] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            const box = document.querySelector('.login-container');
            if (box) {
                const { left, top, width, height } = box.getBoundingClientRect();
                const x = e.clientX - (left + width / 2);
                const y = e.clientY - (top + height / 2);
                const rotateX = (y / height) * 10; // Adjust rotation strength
                const rotateY = (x / width) * -10; // Adjust rotation strength
                setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("https://nft-nexus-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginDetails),
        });
        const json = await response.json();
        if (json.flag) {
            localStorage.setItem('token', json.authToken);
            navigate("/main");
        } else {
            alert("Invalid Credentials, Try Again", "warning");
        }
    };

    const onchange = (e) => {
        setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
    };

    return (
      <div className="bdy">
        <div>
            {/* Background text */}
            <div id="emailHelp-background">NFT NEXUS</div>

            {/* Login container */}
            <div
                className="login-container"
                style={{
                    transform: transform,
                }}
            >
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-title">Welcome Back</h2>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            onChange={onchange}
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            onChange={onchange}
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className="signup-text">
                        Don't have an account? <a href="/signup">Create Account</a>
                    </p>
                </form>
            </div>
        </div>
        </div>
    );
}
