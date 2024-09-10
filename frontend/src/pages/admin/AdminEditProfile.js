import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import sign from "../../assets/sign-removebg-preview.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";

const AdminEditProfile = () => {

    const [auth, setAuth] = useAuth();

    const[formdata,setFormdata]=useState({emailId:auth.user.emailId,oldPassword:"",newPassword:"",confirmNewPassword:"",name:auth.user.name,username:auth.user.username,address:auth.user.address,phoneNumber:auth.user.phoneNumber});

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

        try{   

            if(formdata.newPassword !== formdata.confirmNewPassword){
                toast.error("New Password not matched with confirm password");
                return;
            }

            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/update-profile`, {name:formdata.name, oldPassword: formdata.oldPassword, newPassword:formdata.newPassword, confirmNewPassword: formdata.confirmNewPassword, phoneNumber:(formdata.phoneNumber).toString(), address:formdata.address});
        
            if(res?.data?.success){
                setAuth({
                    ...auth,
                    user: res?.data?.user
                });
                localStorage.setItem("auth", JSON.stringify(res.data));
                toast.success(res?.data?.message);
                setFormdata((prevData)=>(
                    {
                        ...prevData,
                        oldPassword:"",
                        newPassword:"",
                        confirmNewPassword:"",
                    }
                ));
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

    return (
        <Layout title="MedTech - Edit Profile">
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
                    <pre className="text-xl font-extrabold mt-4 ml-24">Update Admin Profile</pre>

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
                <input
                required
                type="text"
                name="username"
                value={formdata.username}
                placeholder="enter your Username" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                </input>
                </div>


                <div>
                <input
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
                name="oldPassword"
                value={formdata.oldPassword}
                placeholder="Enter Old Password" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                </input>
                </div>

                <div>
                <input onChange={changeHandler}
                required
                type="password"
                name="newPassword"
                value={formdata.newPassword}
                placeholder="Enter New Password" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                </input>
                </div>

                <div>
                <input onChange={changeHandler}
                required
                type="password"
                name="confirmNewPassword"
                value={formdata.confirmNewPassword}
                placeholder="Enter New Confirmpassword" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
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

                <button type="submit" className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Update Profile</button>
                </div>
                </div>
                </form>
                
                
            </div>
            </div>
        </Layout>
    );
};

export default AdminEditProfile;