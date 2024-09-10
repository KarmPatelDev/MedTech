import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layouts/Layout";
import hpb from "../../assets/hbp-removebg-preview.png"
import pulse from "../../assets/pulse-removebg-preview.png"
import lbp from "../../assets/lbp-removebg-preview.png"
import weight from "../../assets/weight-removebg-preview.jpg"

const PatientDetails = () => {

    const [showmore, setShowmore] = useState("");
    const { id } = useParams();
    const [showMethod, setShowMethod] = useState(true);
    const [answer, setAnswer] = useState();
    const [show, setShow] = useState("none");

    const[formdata,setFormdata]=useState({advice:""});
  
    const changeHandler = async (event) => {
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
            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/bookappointment/update-patient-status`, {id: id, advice: formdata.advice});
        
            if(res?.data?.success){
                toast.success(res?.data?.message);
                setShow("none");
                setFormdata({advice:""});
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

    const getAnswer = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/ai/chatgpt`, {symptoms: `Find The Diseases Of This Type Of Symptoms Like ${showmore.symptoms}`});
            
            if(res?.data?.success){
                setAnswer(res?.data?.answer);
            }
            else{
                toast.error(res?.data?.message);
            }
        } 
        catch (error) {
            console.log(error);
        }
    };
    
    const fetchData = async () => {
        
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/bookappointment/get-doctor-patient/${id}`);
            
            if(res?.data?.success){
                setShowmore(res?.data?.booked);
                console.log(res?.data?.booked);
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
                <div className="h-12 ml-4 rounded-2xl border-blue-700 px-96 max-w-[2/3] border-2 "><pre className="mt-2 mr-[56px] text-xl font-bold">Predict the Diseases with AI</pre></div>
            </div>

        <div className="flex flex-row space-x-14 ml-4 mt-4">

            <div className="h-36 w-48 border-2 rounded-2xl border-blue-700" >    
               <img src={weight} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite" />
               <div className="flex flex-row space-x-4 ml-8">
               <p className="ml-5">height</p>
               <p className="ml-20 font-extrabold text-blue-700">{showmore.height}</p>
               </div>

                <div className="flex flex-row space-x-4 ml-8">
                <p className="ml-5">weight</p>
                <p className="ml-20 font-extrabold text-blue-700">{showmore.weight}</p>
                </div>
            </div>

            <div className="h-36 w-48 border-2 ml-2 rounded-2xl border-blue-700">
                <div>
                <img src={pulse} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite"/>
                    <p className="ml-14 items-center">pulse Rate:</p>
                    <p className="ml-20 font-extrabold text-blue-700">{showmore.pulse}</p>
                </div>
            </div>

            <div className="h-36 w-48 border-2 rounded-2xl border-blue-700" >
                <img src={lbp} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite" />
                <p className="ml-5">Low Blood Pressure</p>
                <p className="ml-20 font-extrabold text-blue-700">{showmore.lowBloodPressure}</p>
            </div>

            <div className="h-36 w-48 border-2 rounded-2xl border-blue-700">
                <img src={hpb} height={56} width={56} className="ml-16 mt-4 animate__animated animate__pulse animate__slow 2s animate__infinite"/>
                <p className="ml-5">High Blood Pressure</p>
                <p className="ml-20 font-extrabold text-blue-700">{showmore.highBloodPressure}</p>
            </div>
        </div>

             <div className="flex flex-row space-x-24">
                <div>
                    <h4 className="text-center relative top-5">Symptoms</h4>
                <p className="mt-8 ml-6 text-xl font-bold h-36 w-96 ml-16 drop-shadow-lg rounded-2xl border-2 border-blue-700 py-2 px-2">{showmore.symptoms}</p>
                
                </div>
                <div>
                    <h4 className="text-center relative top-5">Advice</h4>
                    <p className="mt-8 ml-12 text-xl font-bold h-36 w-96 ml-16 drop-shadow-lg rounded-2xl border-2 border-blue-700 py-2 px-2">{showmore.advice}</p>
                    
                </div>
             </div>

             <div style={{display:"flex", justifyContent: "space-evenly", alignItems: "center", margin: "20px"}}>
                {/* <button className="boder border-black  rounded-2xl bg-blue-700 py-3 px-3 text-center border" onClick={() => setShowMethod(true)}>AI API</button> */}
                {/* <button className="boder border-black  rounded-2xl bg-blue-700 py-3 px-3 text-center border" onClick={() => setShowMethod(false)}>AI Model</button> */}
             </div>

             
            {
                showMethod ? <>
                <div className="text-center flex flex-col justify-center mt-5 mb-5">
                    <button onClick={getAnswer} className="boder border-black  rounded-2xl bg-blue-700 py-3 px-3 text-center border">AI API</button>
                    <p className="mt-8  text-xl font-bold h-36 w-full  drop-shadow-lg rounded-2xl border-2 border-blue-700 py-2 px-2 item-center text-center">{answer}</p>
                </div>
                </> : <>
                <div className="text-center flex flex-col justify-center mt-5 mb-5">
                    <button className="boder border-black  rounded-2xl bg-blue-700 py-3 px-3 text-center border">AI Model</button>
                </div>
                </>
            }
             
            <div className="text-center">
            <button className="border border-black bg-blue-800 text-white py-2 px-3 rounded-lg m-5" onClick={() => setShow("flex")}>Add Advice</button>
             </div>

           </div>
           
        </div>
      

        <div style={{display: show, alignItems: "center", justifyContent: "center", flexDirection: "column"}} className="m-10 p-5 border-2 rounded-xl">
            <h4 className="text-xl font-extrabold mt-4">Update Advice</h4>   
            <form onSubmit={submitHandler} className="flex flex-col"> 
            <input onChange={changeHandler}
            required
            type="text"
            name="advice"
            value={formdata.advice}
            placeholder="Enter your Advice" className="w-72 my-8 p-3 rounded-3xl drop-shadow-lg">
            </input>

            <button type="submit" className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Update</button>
            </form>
        </div>         
        </Layout>
    );
};

export default PatientDetails;