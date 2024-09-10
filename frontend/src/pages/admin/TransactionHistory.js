import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import { toast } from "react-toastify";


const TransactionHistory = () => {

    const [history, setHistory] = useState([]);

    const fetchData = async() => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/bookappointment/get-transactions`);
            if(res?.data?.success){
                setHistory(res?.data?.history);
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


    return (
        <Layout title="MedTech - Transaction History">
            <div>
            {
                history.length && history.map((transaction) => {
                    return(<>
                        {
                            transaction.history.length && transaction.history.map((trans) => {
                                return(<>
                                <br/>
                                <h1>{transaction.name}</h1>
                                <br/>
                                <div style={{display:"flex", direction: "row", gap:5}}>
                                    <h1>{trans.doctor.name}</h1>
                                    <h1>{trans.patient.name}</h1>
                                    <h1>{trans.appointmentTime}</h1>
                                </div>
                                </>);
                            })
                        } 
                    
                    </>);
                })
            }
         </div>
        </Layout>
    );
};

export default TransactionHistory;