import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import sign from "../../assets/sign-removebg-preview.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";

const DoctorEditProfile = () => {

    const [auth, setAuth] = useAuth();
    const [categories, setCategories] = useState([]);

    const[formdata,setFormdata]=useState({emailId:auth.user.emailId,oldPassword:"",newPassword:"",confirmNewPassword:"",name:auth.user.name,username:auth.user.username,address:auth.user.address,phoneNumber:auth.user.phoneNumber, category:auth.user.category, description:auth.user.description, fees:auth.user.fees, photo:"", certificate:""});
  
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
    }, []);

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

            if(formdata.newPassword !== formdata.confirmNewPassword){
                toast.error("New Password not matched with confirm password");
                return;
            }

            const formData = new FormData();
            formData.append("name", formdata.name);
            formData.append("oldPassword", formdata.oldPassword);
            formData.append("newPassword", formdata.newPassword);
            formData.append("phoneNumber", formdata.phoneNumber);
            formData.append("address", formdata.address);
            formData.append("description", formdata.description);
            formData.append("fees", formdata.fees);
            formData.append("category", formdata.category);
            formData.append("photo", formdata.photo);
            formData.append("certificate", formdata.certificate);

            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/doctor/update-profile`, formData);
        
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
                    <pre className="text-xl font-extrabold mt-4 ml-24">Update Doctor Profile</pre>

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

                <button type="submit" className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Update Profile</button>
                </div>
                </div>
                </form>
                
                
            </div>
            </div>
        </Layout>
    );
};

export default DoctorEditProfile;