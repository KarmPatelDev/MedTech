import React, { useState, useEffect } from "react";
// import logo from '../../../assets/logomed.png';
// import 'animate.css';
import sign from "../../../assets/sign-removebg-preview.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import Layout from "../../../components/layouts/Layout";

const DoctorSignup = () => {

    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const[formdata,setFormdata]=useState({emailId:"",password:"",confirmPassword:"",name:"",username:"",description:"",fees:"",address:"",phoneNumber:"",category:"",photo:"",certificate:""});

    const [categories, setCategories] = useState([]);
  
    const fetchData = async() => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-categories`);
            if(res?.data?.success){
                setCategories(res?.data?.categories);
            }
            else{
                toast.error(res?.data?.message);
              }
            } 
        catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const changeHandler = async (event) => {
        if(event.target.name !== 'photo' && event.target.name !== 'certificate'){
            setFormdata((prevData)=>(
                {
                    ...prevData,
                    [event.target.name]:event.target.value
                }
              ))
        }
        else{
            setFormdata((prevData)=>(
                {
                    ...prevData,
                    [event.target.name]:event.target.files[0]
                }
              ))
        }      
    };

    const submitHandler = async (event) => {
        event.preventDefault();
    
        try{
            const formData = new FormData();
            formData.append("name", formdata.name);
            formData.append("username", formdata.username);
            formData.append("emailId", formdata.emailId);
            formData.append("password", formdata.password);
            formData.append("confirmPassword", formdata.confirmPassword);
            formData.append("phoneNumber", formdata.phoneNumber);
            formData.append("address", formdata.address);
            formData.append("description", formdata.description);
            formData.append("fees", formdata.fees);
            formData.append("category", formdata.category);
            formData.append("photo", formdata.photo);
            formData.append("certificate", formdata.certificate);
            
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/doctor/register`, formData);
        
            if(res?.data?.success){
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
        <div className="flex flex-row space-x-11 mt-[-64px]">
        <div>
            <img src={sign} alt="" className="mt-20 ml-32 animate__animated animate__pulse animate__slow 2s animate__infinite"></img>
            {/* image */}

        </div>

        <div className=" mt-[-64px]">
            {/* /form */}
              <div className="flex flex-col   mt-48">
               
                <pre className="mt-[-64px] text-blue-500">Bettering the human condition</pre>
                <pre className="text-xl font-extrabold mt-4 ml-24">Sign Up</pre>   
               
               <div className="space-y-4 flex flex-col overflow-y-scroll max-h-96 ">

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
                name="description"
                value={formdata.description}
                placeholder="enter your description" className="w-72  border-1 border-cyan-800 p-2 drop-shadow-lg rounded-3xl">
                </input>
                </div>

                
                <div>
                <input onChange={changeHandler}
                required
                type="number"
                name="fees"
                value={formdata.fees}
                placeholder="enter your fees" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                </input>
                </div>

                <div>
                    <select onChange={changeHandler} name="category" value={formdata.category} className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                        <option value="" disabled hidden>Choose a Category</option>
                        {categories?.map((category) => (<option key={category._id} value={category._id}>{category.name}</option>))}
                    </select>
                </div>

                <div className="border border-black w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                    <label>
                        {formdata.photo ? formdata.photo.name : "Upload Doctor Photo"}
                        <input type="file" name="photo" accept="image/*" onChange={changeHandler} hidden />
                    </label>
                </div>

                <div className="border border-black w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                    <label>
                        {formdata.certificate ? formdata.certificate.name : "Upload Cerificate Photo"}
                        <input type="file" name="certificate" accept="image/*" onChange={changeHandler} hidden />
                    </label>
                </div>

                <div className="flex flex-row">
                {/* <Link to="/signupdoctor">
                <pre className="text-sm  underline text-sky-700 mt-1">forget Password?/</pre></Link> */}
                <Link to="/doctor/login">
               <span className="text-sky-700 ">Login</span></Link>
                </div>

                <button onClick={submitHandler} className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Signup</button>
               </div>
              </div>
        </div>
        </div>
        </Layout>
    );
};

export default DoctorSignup;