import { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";

export const Register = ({setUser}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    const handleSubmit=(e) => {
        e.preventDefault()
        axios

        .post('https://safe-plains-62725.herokuapp.com/auth/users/',{username, password})
        .then((res) => setUser(username, res.data.auth_token))} 

        
    return (
        <div>
    <CssVarsProvider>
      <Sheet />
    </CssVarsProvider>
            <form className="register">
            <h3>Register</h3>
                <div className="userfield">
                    <input className="input" type="text" placeholder="username" 
                    onChange={(e) => setUsername(e.target.value)}/> 
                </div>
                <div className="passwordfield">
                    <input className="input" type="password" placeholder="password" 
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button onClick={handleSubmit}>Register</button>
            </form>
            <button><Link to="/Login">Close Window</Link></button>
        </div>
)}