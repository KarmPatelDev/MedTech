import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorApprove = () => {

    const [doctors, setDoctors] = useState([]);

    const fetchData = async() => {
        try {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/doctor/get-doctors-list`);
        if(res?.data?.success){
            setDoctors(res?.data?.doctors);
        }
        else{
            toast.error(res?.data?.message);
        }
        } 
        catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const editApproval = async (event, id) => {
        event.preventDefault();

        try {
            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/doctor/update-approval/${id}`, {approval: event.target.value});
            if(res?.data?.success){
                toast.success(res?.data?.message);
                fetchData();
            }
            else{
                toast.error(res?.data?.message);
            }
            } 
        catch (error) {
            toast.error(error);
        }
    }

    return (
        <Layout title="MedTech - Doctor Approving">
            <div className="category">
            {
            doctors.map( (doctor) => {
              return(
                  <div class="catagory-box">
                    <div class="catagory-image">
                          <img src={`${process.env.REACT_APP_API}/api/v1/doctor/get-doctor-photo/${doctor._id}`} alt="" class="h-16" />
                      </div>
                      <div class="catagory-image">
                          <img src={`${process.env.REACT_APP_API}/api/v1/doctor/get-doctor-certificate-photo/${doctor._id}`} alt="" class="h-16" />
                      </div>
                      <div class="catagory-content">
                              <h2>{doctor.name}</h2>
                      </div>
                      <select value={doctor.approval} onChange={(event) => editApproval(event, doctor._id)}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                    </select>
                  </div>
              )
            }
            )
          }
          </div>
        </Layout>
    );
};

export default DoctorApprove;