import React from "react";
import Layout from "../../components/layouts/Layout";
import docImage from "../../assets/doctor-image.jpg";
import "../../styles/Home.css";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <Layout title={'MedTech - HomePage'}>

            <div className=" w-11/12 max-w-[1300px] mx-auto">
            
            <section id="slogan" className="slogan flex gap-10 mt-8 items-center"> 
                <div className="slogan-content scroll-scale max-w-[60%]">
                    <h1>We offer <span class="duration">24/7 </span> emergency care and primary services focused on wellness and prevention. </h1>
                    <p>Our dedicated team supports your health needs, from urgent situations to routine check-ups.</p>
                
                    <div className="slogan-btn">
                        <Link to="/categories"><button class="btn"><h3>Choose Catagory</h3></button></Link>
                    </div>
                </div>
                <div className="slogan-image">
                    <div className="img-box">
                        <img src={docImage} alt="" className=""/>
                    </div>
                </div>
            
            </section>

            </div>

        </Layout>
    );
};

export default HomePage;