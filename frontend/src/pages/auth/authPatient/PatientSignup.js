import React, { useState } from "react";
// import 'animate.css';
// import logo from '../../../assets/logomed.png'
import sign from "../../../assets/sign-removebg-preview.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import Layout from "../../../components/layouts/Layout";

const PatientSignup = () => {

    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const[formdata,setFormdata]=useState({emailId:"",password:"",confirmPassword:"",name:"",username:"",address:"",birthdate:"",gender:"",phoneNumber:""});

    const changeHandler = (event) => {
        setFormdata((prevData)=>(
            {
                ...prevData,
                [event.target.name]:event.target.value
            }
          ));
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        console.log(formdata);
        try{   
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/patient/register`, {name:formdata.name, username:formdata.username, emailId:formdata.emailId, password: formdata.password, confirmPassword: formdata.confirmPassword, phoneNumber:formdata.phoneNumber, address:formdata.address, birthdate:formdata.birthdate, gender:formdata.gender});
        
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
        <div className="flex flex-row space-x-11 ">
        <div>
            <img src={sign} alt="" className="mt-0 ml-32 animate__animated animate__pulse animate__slow 2s animate__infinite"></img>
            {/* image */}

        </div>

        <div className="mb-auto">
            {/* /form */}

            <form onSubmit={submitHandler}>
              <div className="flex flex-col mt-8  ">
               
                <pre className="mt-[-64px] text-blue-500">Bettering the human condition</pre>
                <pre className="text-xl font-extrabold mt-4 ml-24">Sign Up</pre>

               <div className="space-y-4 flex flex-col overflow-y-scroll max-h-96  ">

               <div>
               <input onChange={changeHandler}
               required
               type="text"
               name="name"
               value={formdata.name}
               placeholder="enter your Name" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>


               <div>
               <input onChange={changeHandler}
               required
               type="text"
               name="username"
               value={formdata.username}
               placeholder="enter your Username" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>


              <div>
              <input onChange={changeHandler}
               required
               type="email"
               name="emailId"
               value={formdata.emailId}
               placeholder="enter your emailId" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
              </div>

               <div>
               <input onChange={changeHandler}
               required
               type="password"
               name="password"
               value={formdata.password}
               placeholder="enter password" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>

               <div>
               <input onChange={changeHandler}
               required
               type="password"
               name="confirmPassword"
               value={formdata.confirmPassword}
               placeholder="enter confirmpassword" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>

               <div>
               <input onChange={changeHandler}
               required
               type="number"
               name="phoneNumber"
               value={formdata.phoneNumber}
               placeholder="enter your phone number" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>
 
                
                <div>
                <input
                required
                onChange={changeHandler}
                type="text"
                name="address"
                value={formdata.address}
                placeholder="enter your address" className="w-72  border-1 border-cyan-800 p-2 drop-shadow-lg rounded-3xl">
                </input>
                </div>

                <div>
                <input
                required
                onChange={changeHandler}
                type="text"
                name="birthdate"
                value={formdata.birthdate}
                placeholder="enter your birthdate" className="w-72  border-1 border-cyan-800 p-2 drop-shadow-lg rounded-3xl">
                </input>
                </div>

                <div className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                    <select onChange={changeHandler} name="gender" value={formdata.gender}>
                        <option value="" disabled hidden>Choose a Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="flex flex-row">
                {/* <Link to="/signuppatient">
                <pre className="text-sm  underline text-sky-700 mt-1">forget Password?/</pre></Link> */}
                <Link to="/patient/login">
               <span className="text-sky-700 ">Login</span></Link>
                </div>

                <button type="submit" className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Signup</button>
               </div>
              </div>
              </form>
              
            
        </div>
        </div>
        </Layout>
    );
};


export default PatientSignup;