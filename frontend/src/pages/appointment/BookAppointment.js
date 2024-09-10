import React, { useState, useEffect } from "react";
// import logo from '../../../assets/logomed.png';
// import 'animate.css';
import sign from "../../assets/sign-removebg-preview.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import Layout from "../../components/layouts/Layout";
import DropIn from "braintree-web-drop-in-react";

const BookAppointment = () => {

    // eslint-disable-next-line
    const [auth] = useAuth();
    const navigate = useNavigate();

    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);

    const { patientslug, doctorslug } = useParams();

    const[formdata,setFormdata]=useState({appointmentTime:"",height:"",weight:"",lowBloodPressure:"",highBloodPressure:"",pulse:"",symptoms:"",photo:""});

    // Payment Token Generate
    const getPaymentToken = async () => {
        try{
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/bookappointment/braintree/token`);

            if(res?.data?.success){
                setClientToken(res?.data?.response?.clientToken);
            }
            else{
                toast.error(res?.data?.message);
            } 
        }
        catch(error){
            console.log(error);
        }
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        // try{
        //     setLoading(true);
        //     const { nonce } = await instance.requestPaymentMethod();

        //     const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/bookappointment/braintree/payment`, {totalCost: doctor?.fees, nonce});
        //     setLoading(false);
        //     console.log("hello1");
        //     if(res?.data?.success){


                try{
                    const formData = new FormData();
                    formData.append("patientSlug", patientslug);
                    formData.append("doctorSlug", doctorslug);
                    formData.append("appointmentTime", formdata.appointmentTime);
                    formData.append("height", formdata.height);
                    formData.append("weight", formdata.weight);
                    formData.append("lowBloodPressure", formdata.lowBloodPressure);
                    formData.append("highBloodPressure", formdata.highBloodPressure);
                    formData.append("pulse", formdata.pulse);
                    formData.append("symptoms", formdata.symptoms);
                    formData.append("photo", formdata.photo);

                    const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/bookappointment/book-appointment`, formData);
                    if(response?.data?.success){
                        toast.success(response?.data?.message);
                        navigate('/');
                    }
                    else{
                        toast.error(response?.data?.message);
                    }

                }
                catch(error){
                    toast.error(error);
                }
                
            // }
            // else{
            //     toast.error(res?.data?.message);
            // } 
        // }
        // catch(error){
        //     console.log(error);
        //     setLoading(false);
        //     toast.error("Something Went Wrong.");
        // }
    };

    useEffect(() => {
        getPaymentToken();
    }, [auth?.token]);

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
              ));
        }      
    };

    return(
        <Layout>
        <div className="flex flex-row space-x-11 mt-[-64px]">
        <div>
            <img src={sign} alt="" className="mt-20 ml-32 animate__animated animate__pulse animate__slow 2s animate__infinite"></img>
            {/* image */}

        </div>

        <div className=" mt-[-64px]">
            {/* /form */}
              <div className="flex flex-col   mt-48">
               
                <pre className="mt-[-64px] text-blue-500">Bettering the human condition</pre>
                <pre className="text-xl font-extrabold mt-4 ml-24">Book Appointment</pre>   
               
               <div className="space-y-4 flex flex-col overflow-y-scroll max-h-96 ">

               <div>
               <input onChange={changeHandler}
               required
               type="datetime-local"
               name="appointmentTime"
               value={formdata.appointmentTime}
               placeholder="enter your Time" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>


               <div>
               <input onChange={changeHandler}
               required
               type="text"
               name="height"
               value={formdata.height}
               placeholder="enter your Height" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>

               <div>
               <input onChange={changeHandler}
               required
               type="text"
               name="weight"
               value={formdata.weight}
               placeholder="enter your Weight" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>

               <div>
               <input onChange={changeHandler}
               type="text"
               name="lowBloodPressure"
               value={formdata.lowBloodPressure}
               placeholder="enter your lowBloodPressure" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>

               <div>
               <input onChange={changeHandler}
               type="text"
               name="highBloodPressure"
               value={formdata.highBloodPressure}
               placeholder="enter your highBloodPressure" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>

               <div>
               <input onChange={changeHandler}
               type="text"
               name="pulse"
               value={formdata.pulse}
               placeholder="enter your pulse" className="w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
               </input>
               </div>
                
                <div>
                <input
                required
                onChange={changeHandler}
                type="text"
                name="symptoms"
                value={formdata.symptoms}
                placeholder="enter your symptoms" className="w-72  border-1 border-cyan-800 p-2 drop-shadow-lg rounded-3xl">
                </input>
                </div>

                <div className="border border-black w-72 p-2 mt-4 rounded-3xl drop-shadow-lg">
                    <label>
                        {formdata.photo ? formdata.photo.name : "Upload Document Photo"}
                        <input type="file" name="photo" accept="image/*" onChange={changeHandler} hidden />
                    </label>
                </div>
                
                <hr/>
                <div>
                    {
                        auth?.token ? (
                            (!clientToken) ? ("") : (
                                <>
                                <DropIn options={{ authorization: clientToken, paypal: {flow: "vault"} }} onInstance={(instance) => setInstance(instance)} />
                                <button className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white" onClick={handlePayment} disabled={loading || !instance || !auth?.token}>{loading ? "Processing" : "Pay"}</button>
                                </>
                            )
                        ) : (
                        <button onClick={() => navigate('/patient/login')}>Login/SignUp To Payment</button>
                        )         
                    }
                </div>


               </div>
              </div>
        </div>
        </div>
        </Layout>
    );
};

export default BookAppointment;