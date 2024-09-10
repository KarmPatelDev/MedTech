import React from "react";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {

    const[auth,setAuth] = useAuth();

    const handleLogout = async () => {

        try{
            let res;
    
            if(auth?.user?.role === 0) res = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/logout`);
            else if(auth?.user?.role === 1) res = await axios.get(`${process.env.REACT_APP_API}/api/v1/doctor/logout`);
            else res = await axios.get(`${process.env.REACT_APP_API}/api/v1/patient/logout`);
    
            if(res.data.success){
                setAuth({
                    ...auth,
                    user: null,
                    token: ""
                });
                localStorage.removeItem("auth");
                toast.success("Logout Successful");
            }
            else{
                toast.error("Logout Unsuccessful");
            }
    
        }
        catch(error){
            toast.error(error);
        }
    
    };


    return(
        <div className="flex justify-between p-5 items-center ">

            <div className="logo">
                <img src={logo} alt="" className="h-[8rem] w-[10rem]"/>
            </div>
            
            <div >
                <ul className="navlist flex flex-row gap-10">
                    <li  className="text-xl font-bold">
                        <NavLink to="/">
                        <pre>Home</pre>
                        </NavLink>
                    </li>

                    <li className="text-xl font-bold">
                        <NavLink to="/services">
                            <pre>Services</pre>
                        </NavLink>
                    </li>

                    {/* <li className="text-xl font-bold">
                        <NavLink to="/about">
                            <pre>About</pre>
                        </NavLink>
                    </li> */}


                    {
                    auth?.user?.role === 0 ? (
                        <>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/admin/manage-categories">
                        <pre>Manage Categories</pre>
                        </NavLink>
                        </li>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/admin/doctor-approving">
                        <pre>Doctor Approving</pre>
                        </NavLink>
                        </li>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/admin/transaction-history">
                        <pre>Transaction History</pre>
                        </NavLink>
                        </li>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/admin/edit-profile">
                        <pre>Edit Profile</pre>
                        </NavLink>
                        </li>
                        </>) : (<></>)
                    }

                    {
                    auth?.user?.role === 1 ? (
                        <>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/doctor/show-patients">
                        <pre>Show Patients</pre>
                        </NavLink>
                        </li>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/doctor/edit-profile">
                        <pre>Edit Profile</pre>
                        </NavLink>
                        </li>
                        </>
                    ) : (<></>)
                    }

                    {
                    auth?.user?.role === 2 ? (
                        <>
                        <li  className="text-xl font-bold">
                        <NavLink to="/categories">
                        <pre>Appointment</pre>
                        </NavLink>
                        </li>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/patient/get-history">
                        <pre>History</pre>
                        </NavLink>
                        </li>
                        <li  className="text-xl font-bold">
                        <NavLink to="/user/patient/edit-profile">
                        <pre>Edit Profile</pre>
                        </NavLink>
                        </li>
                        </>
                    ) : (<></>)
                    }


                    {
                        auth && auth?.token ? (
                            <li  className="text-xl font-bold">
                                <NavLink to="/select-login-method">
                                <button onClick={handleLogout}>Logout</button>
                                </NavLink>
                            </li>
                        ) : (
                            <li  className="text-xl font-bold">
                                <NavLink to="/select-login-method">
                                <pre>LogIn</pre>
                                </NavLink>
                            </li>
                        )
                    }
                </ul>
            </div>

        </div>
       
    );
};

export default Header;