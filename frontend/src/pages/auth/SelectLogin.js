import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layouts/Layout";

function SelectLogin(){
    return(
        <Layout>
            
        <div className="border-4 h-[300px] rounded-2xl  flex flex-col space-y-4 border-cyan-600 back-image justify-center items-center w-11/12 max-w-[500px] mx-auto" style={{background: 'linear-gradient(90deg, rgba(201,93,75,1) 0%, rgba(75,248,173,1) 45%, rgba(0,212,255,1) 100%)'}}>
          
          
          <Link to="/doctor/login">
                <button className=" font-bold bg-cyan-600 p-2 rounded-2xl px-4 hover:text-white duration-1000 text-white">
                    As Doctor
                </button>
           </Link>

           <Link to="/patient/login">
              <button className=" font-bold bg-cyan-600 p-2 rounded-2xl px-4 hover:text-white duration-1000 text-white">
                 As Patient
              </button>

           </Link>
          </div>
        </Layout>
    );
};
export default SelectLogin;