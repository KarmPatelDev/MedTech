import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layouts/Layout';
import "../styles/Categories.css";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import categoriesImageData from "../assets/CategoriesData";

const Categories = () => {
 
  const [categories, setCategories] = useState([]);
  
  const fetchData = async() => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-categories`);
      if(res?.data?.success){
        setCategories(res?.data?.categories);
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
    <Layout>
        {/* <div className='w-11/12 max-w-[1200px] mx-auto flex flex-row'> */}
        <section id="home" class="home">
        <div class="catagory">
          {
            categories.map( (item) => {
              var data = (categoriesImageData.filter((category) => item.slug === category.slug));
              return(
                <Link to={`/category/${item.slug}`}>
                  <div class="catagory-box">
                      <div class="catagory-image">
                          <img src={`${process.env.REACT_APP_API}/api/v1/category/get-category-photo/${item._id}`} alt="" class="h-16" />
                      </div>
                      <div class="catagory-content">
                              <h2>{item.name}</h2>
                      </div>
                  </div>
                </Link>
              )
            }
            )
          }
          
        </div>
        </section>
        {/* </div> */}
    </Layout>
    
    
  );
};

export default Categories;
