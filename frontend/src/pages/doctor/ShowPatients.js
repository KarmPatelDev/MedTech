import React, { useEffect, useState } from 'react';
import Layout from '../../components/layouts/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import avatar from "../../assets/doctoravatar.jpeg";

const ShowPatients = () => {

    const [patient, setPatient] = useState([]);
    
    const fetchData = async() => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/bookappointment/get-doctor-patients`);

            if(res?.data?.success){
                setPatient(res?.data?.patients);
            }
            else{
                toast.error(res?.data?.message);
            }
        } 
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [] )

  return (
    <Layout>
        <div className='flex flex-row justify' >
            <div className='w-11/12 max-w-[1000px]  mx-auto grid grid-cols-3 gap-5  text-center justify-center items-center'>
            {
                
                patient.map( (item) => {
                    return (
                        <div className='border-blue-700 rounded-2xl border-2 w-fit p-5 flex flex-col items-center gap-3 '>
                            <img src={avatar} alt='' className='h-[5rem] w-[5rem] rounded-full'/>
                            <h1><span>Patients's Name:</span> {item.patient.name}</h1>
                            <h1><span>Time: </span> {item.appointmentTime}</h1>
                            <Link to={`/user/doctor/patient-details/${item._id}`}>
                                <button className='border border-black bg-blue-800 text-white py-2 px-3 rounded-lg'>
                                    Show More
                                </button>
                            </Link> 
                        </div>
                    );
                } )
                

            }
            
            </div>
        </div>
    </Layout>
  )
}

export default ShowPatients;
