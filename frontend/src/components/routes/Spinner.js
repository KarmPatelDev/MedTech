import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";

const Spinner = ({path = "login"}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [count, setCount] = useState(5);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000);
        if(count === 0){
            navigate(`/${path}`, {
                state: location.pathname,
            });
        }
        return () => clearInterval(interval);
    }, [count, navigate, location, path]);

    return(
        <Layout title={'MedTech - Loading...'}>
            <h1>Spinner {count}</h1>
        </Layout>
    );
};

export default Spinner;