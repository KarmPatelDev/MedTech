import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layouts/Layout";
import hpb from "../../assets/hbp-removebg-preview.png"
import pulse from "../../assets/pulse-removebg-preview.png"
import lbp from "../../assets/lbp-removebg-preview.png"
import weight from "../../assets/weight-removebg-preview.jpg"

const HistoryDetail = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const [patientHistory, setPatientHistory] = useState("");
    const [show, setShow] = useState("none");


    const[formdata,setFormdata]=useState({symptoms:"",photo:""});
  
    const changeHandler = async (event) => {
        if(event.target.name !== 'photo'){
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
            formData.append("id", id);
            formData.append("symptoms", formdata.symptoms);
            formData.append("photo", formdata.photo);
            
            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/bookappointment/update-history-status`, formData);
        
            if(res?.data?.success){
                toast.success(res?.data?.message);
                setShow("none");
                setFormdata({symptoms:"",photo:""});
                fetchData();
            }
            else{
                toast.error(res?.data?.message);
            }
        }
        catch(error){
            toast.error(error);
        }
      
    };

    const fetchData = async () => {
        
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/bookappointment/get-patient-history/${id}`);
            
            if(res?.data?.success){
                setPatientHistory(res?.data?.booked);
            }
            else{
                toast.error(res?.data?.message);
            }
        } 
        catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return(
        <Layout>
       
        <div className="font-bold flex flex-row ml-56">
            <div className="font-bold">
            
            <div>
               
                <div className="h-12 ml-4 rounded-2xl border-blue-700 px-96 max-w-[2/3] border-2 "><pre className="mt-2 mr-[56px] text-xl font-bold">History Detail</pre></div>
            </div>

            <div className="flex flex-row space-x-14 ml-4 mt-4">

            <div className="h-36 w-48 border-2 rounded-2xl border-blue-700" >
               
               <img src={weight} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite" />
               <div className="flex flex-row space-x-4 ml-8">
               <p className="ml-5">height</p>
               <p className="ml-20 font-extrabold text-blue-700">{patientHistory.height}</p>
               </div>

              <div className="flex flex-row space-x-4 ml-8">
              <p className="ml-5">weight</p>
               <p className="ml-20 font-extrabold text-blue-700">{patientHistory.weight}</p>
              </div>
             </div>

                <div className="h-36 w-48 border-2 ml-2 rounded-2xl border-blue-700">
                   <div>
                    <img src={pulse} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite"/>
                        <p className="ml-14 items-center">pulse Rate:</p>
                        <p className="ml-20 font-extrabold text-blue-700">{patientHistory.pulse}</p>
                    </div>
                </div>

                <div className="h-36 w-48 border-2 rounded-2xl border-blue-700" >
               
                  <img src={lbp} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite" />
                  <p className="ml-5">Low Blood Pressure</p>
                  <p className="ml-20 font-extrabold text-blue-700">{patientHistory.lowBloodPressure}</p>
                </div>
                <div className="h-36 w-48 border-2 rounded-2xl border-blue-700">
                    <img src={hpb} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite"/>
                   <p className="ml-5">High Blood Pressure</p>
                   <p className="ml-20 font-extrabold text-blue-700">{patientHistory.highBloodPressure}</p>
                </div>
             </div>

                <div className="flex flex-row space-x-24">
                <div>
                    <h4 className="text-center relative top-5">Symptoms</h4>
                <p className="mt-8 ml-6 text-xl font-bold h-36 w-96 ml-16 drop-shadow-lg rounded-2xl border-2 border-blue-700 py-2 px-2">{patientHistory.symptoms}</p>
                
                </div>

                <div>
                    <h4 className="text-center relative top-5">Advice</h4>
                    <p className="mt-8 ml-12 text-xl font-bold h-36 w-96 ml-16 drop-shadow-lg rounded-2xl border-2 border-blue-700 py-2 px-2">{patientHistory.advice}</p>
                    
                </div>
       
                </div>

                <div className="text-center">
                <button className="border border-black bg-blue-800 text-white py-2 px-3 rounded-lg m-5" onClick={() => setShow("flex")}>Update Symptoms</button>
                </div>


            
                <div style={{display: show, alignItems: "center", justifyContent: "center", flexDirection: "column"}} className="my-10 p-5 border-2 rounded-xl">
                    <h4 className="text-xl font-extrabold mt-4">Update Symptoms and Document</h4>   

                    <div className="flex flex-col">

                    <input onChange={changeHandler}
                    required
                    type="text"
                    name="symptoms"
                    value={formdata.symptoms}
                    placeholder="Enter your Symptoms" className="w-72 my-3 p-3 rounded-3xl drop-shadow-lg">
                    </input>

                    <div className="border border-black w-72 p-2 my-5 rounded-3xl drop-shadow-lg">
                        <label>
                            {formdata.photo ? formdata.photo.name : "Upload Doctor Photo"}
                            <input type="file" name="photo" accept="image/*" onChange={changeHandler} hidden />
                        </label>
                    </div>

                    <button onClick={submitHandler} className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Update</button>
                    </div>
                </div>
             

           </div>
        </div>
        <div>
        </div>
        </Layout>
    );
};

export default HistoryDetail;