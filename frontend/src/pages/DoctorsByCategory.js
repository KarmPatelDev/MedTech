import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Layout from '../components/layouts/Layout';
import avatar from "../assets/doctoravatar.jpeg";
import { useAuth } from '../context/Auth';

const DoctorsByCategory = () => {

    const [doctors, setDoctors] = useState([]);
    const { slug } = useParams();
    const [auth] = useAuth();
    
    const fetchData = async() => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/doctor/get-doctors/${slug}`);

            if(res?.data?.success){
                setDoctors(res?.data?.doctors);
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
            <div className='w-11/12 max-w-[1200px] flex flex-row space-x-8 mx-auto border-black flex-wrap gap-3'>
            {
                doctors.map( (item) => {
                    return(<>
                        <div className=' border-blue-700 rounded-2xl border-2 w-fit p-5 flex flex-col items-center gap-3'>
                            <img src={avatar} alt='' className='h-[5rem] w-[5rem] rounded-full'/>
                            <h1><span>Doctor's Name:</span> {item.name}</h1>
                            <h1><span>Description: </span> {item.description}</h1>
                            <h1><span>Fees:</span> {item.fees}</h1>
                            {
                            auth?.token && auth?.user.role === 2 ? (
                            <Link to={`/user/patient/book-appointment/${auth?.user?.slug}/${item.slug}`}><button className='border border-black bg-blue-800 text-white py-2 px-3 rounded-lg'>
                            Book Appointment
                            </button></Link>
                            ):(
                                <Link to={`/patient/signup`}><button className='border border-black bg-blue-800 text-white py-2 px-3 rounded-lg'>
                                Login / Signup To Book
                                </button></Link>
                            )
                            }
                        </div>
                    </>)
                })
            }
            </div>
            </div>
        </Layout>
        
    );
};

export default DoctorsByCategory;
