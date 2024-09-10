import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import avatar from "../../assets/doctoravatar.jpeg";

const PatientHistory = () => {

    const [history, setHistory] = useState();

    const getHistory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/bookappointment/get-history`);
            
            if(res?.data?.success){
                setHistory(res?.data?.history);
                console.log(res?.data?.history)
            }
            else{
                toast.error(res?.data?.message);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <Layout>
            <div className='flex flex-row justify' >
            <div className='w-11/12 max-w-[1200px] flex flex-row space-x-8 mx-auto border-black flex-wrap gap-3'>
            {
                history && history.map((item) => {
                    return(
                        <div className='border-blue-700 rounded-2xl border-2 w-fit p-5 flex flex-col items-center gap-3 '>
                            <img src={avatar} alt='' className='h-[5rem] w-[5rem] rounded-full'/>
                            <h1><span>Patients's Name:</span> {item.patient.name}</h1>
                            <h1><span>Time: </span> {item.appointmentTime}</h1>
                            <Link to={`/user/patient/history-detail/${item._id}`}><button className='border border-black bg-blue-800 text-white py-2 px-3 rounded-lg'>Details</button></Link>   
                        </div>
                    );
                })
            }
            </div>
            </div>
        </Layout>
    );
};

export default PatientHistory;