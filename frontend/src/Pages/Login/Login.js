import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
    const [loginDetails, setLoginDetails] = useState({login:"", password:""})
    let navigate = useNavigate()

    const handleSubmit = async (e)=> {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
        body: JSON.stringify(loginDetails)})
        const json = await response.json();
        console.log(json)
        if(json.flag){

            localStorage.setItem('token' , json.authToken);
            
            navigate("/main");
            
        }else{
          alert("Invalid Credentials, Try Again","warning")
        }
    }
    const onchange = (e)=> {
        setLoginDetails({...loginDetails, [e.target.name]: e.target.value})

    }
  return (
    <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label for="email" className="form-label">Email address</label>
    <input type="email" className="form-control" onChange={onchange} id="email" name="email" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label for="password" className="form-label">Password</label>
    <input type="password" className="form-control" onChange={onchange} name="password" id="password"/>
  </div>
  
  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
  )
}
