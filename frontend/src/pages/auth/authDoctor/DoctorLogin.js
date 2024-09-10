import React, { useState } from "react";
import docimf from '../../../assets/doctor-removebg-preview.png';
import logo from '../../../assets/logomed.png';
// import 'animate.css';
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/Auth";
import Layout from "../../../components/layouts/Layout";

const DoctorLogin = () => {

    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const[formdata,setFormdata]=useState({credentials:"",password:""});

    const changeHandler = (event) => {
        setFormdata((prevData) => (
            {
                ...prevData,
                [event.target.name]:event.target.value
            }
        ));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try{   
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/doctor/login`, {credentials: formdata.credentials, password: formdata.password});
        
            if(res?.data?.success){
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                toast.success(res?.data?.message);
                navigate(location.state || "/");
            }
            else{
                toast.error(res?.data?.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error(error);
        }
    
    };

    return(
        <Layout>
        <div className="flex flex-row space-x-11 mt-[-56px]">
        <div>
            <img src={docimf} alt="" className="mt-20 ml-32 animate__animated animate__pulse animate__slow 2s animate__infinite"></img>
            {/* image */}

        </div>

        <div className="">
            {/* /form */}

            <form onSubmit={submitHandler}>
              <div className="flex flex-col   mt-16">
                <img src={logo} alt="" height={90} width={200} />
                <pre className="mt-[-64px] text-blue-500">Bettering the human condition</pre>
                <pre className="text-xl font-extrabold mt-4 ml-24">Log in</pre>
               
                <div className="space-y-4 flex flex-col ">
                <input onChange={changeHandler}
                required
                type="text"
                name="credentials"
                value={formdata.credentials}
                placeholder="enter your email/username" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                </input>
    
                <input
                required
                onChange={changeHandler}
                type="password"
                name="password"
                value={formdata.password}
                placeholder="enter your password" className="w-72  border-1 border-cyan-800 p-2 drop-shadow-lg rounded-3xl">
                </input>

                <div className="flex flex-row">
                {/* <Link to="/signupdoctor">
                <pre className="text-sm  underline text-sky-700 mt-1">forget Password?/</pre></Link> */}
                <Link to="/doctor/signup">
                <span className="text-sky-700 ">Sign Up</span></Link>
                </div>

                <button type="submit" className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Login</button>
               </div>
              </div>
              
            </form>
        </div>
        </div>
        </Layout>
    );
};

export default DoctorLogin;