import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/Categories.css";

const ManageCategories = () => {

    const[formdata,setFormdata]=useState({name:"",photo:""});
    const [editFormdata, setEditFormdata]=useState({id: "",name:"",photo:""});
    const [categories, setCategories] = useState([]);
    const [show, setShow] = useState(false);
  
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

    const editChangeHandler = async (event) => {
        if(event.target.name !== 'photo'){
            setEditFormdata((prevData)=>(
                {
                    ...prevData,
                    [event.target.name]:event.target.value
                }
              ))
        }
        else{
            setEditFormdata((prevData)=>(
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
            formData.append("name", formdata.name);
            formData.append("photo", formdata.photo);
            
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, formData);
        
            if(res?.data?.success){
                toast.success(res?.data?.message);
                setFormdata({name:"",photo:""});
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

    const editCategory = async (event) => {
        event.preventDefault();
    
        try{
            const formData = new FormData();
            formData.append("name", editFormdata.name);
            formData.append("photo", editFormdata.photo);
            
            const res = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${editFormdata.id}`, formData);
        
            if(res?.data?.success){
                toast.success(res?.data?.message);
                setEditFormdata({id:"",name:"",photo:""});
                setShow(false);
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

    const deleteCategory = async (id) => {
    
        try{
            const res = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`);
        
            if(res?.data?.success){
                toast.success(res?.data?.message);
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

    return (
        <Layout title="MedTech - Manage Categories">

        <div style={{display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: "column"}} className="m-10 p-5 border-2 rounded-xl">
            <h4 className="text-xl font-extrabold mt-4">Add Categories</h4>       

            <div className="flex flex-col">
           
            <input onChange={changeHandler}
            required
            type="text"
            name="name"
            value={formdata.name}
            placeholder="Enter your Category" className="w-72 my-8 p-3 rounded-3xl drop-shadow-lg">
            </input>

            <div className="border border-black w-72 p-2 my-5 rounded-3xl drop-shadow-lg">
            <label>
                {formdata.photo ? formdata.photo.name : "Upload Category Photo"}
                <input type="file" name="photo" accept="image/*" onChange={changeHandler} hidden />
            </label>
            </div>

            <button onClick={submitHandler} className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Submit</button>
            </div>
        </div>




        <div class="category">
        {
            categories.map( (item) => {
              return(
                  <div class="catagory-box">
                        <div class="catagory-image">
                          <img src={`${process.env.REACT_APP_API}/api/v1/category/get-category-photo/${item._id}`} alt="" class="h-16" />
                        </div>
                        <div class="catagory-content">
                                <h2>{item.name}</h2>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between", color: "white", backgroundColor: "red"}}>
                            <button onClick={() => {
                                setShow(true);
                                setEditFormdata({id:item._id, name:item.name, photo: ""});
                            }}>Edit</button>
                            <button onClick={() => deleteCategory(item._id)}>Delete</button>
                        </div>
                  </div>
              )
            }
            )
        }
        </div>

        {
            show ? 
            <div style={{display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: "column"}} className="m-10 p-5 border-2 rounded-xl">

                <h4 className="text-xl font-extrabold mt-4">Edit Categories</h4>  

                <div className="flex flex-col">

                <input onChange={editChangeHandler}
                required
                type="text"
                name="name"
                value={editFormdata.name}
                placeholder="Enter your Category" className="w-72 my-3 p-3 rounded-3xl drop-shadow-lg">
                </input>

                <div className="border border-black w-72 p-2 my-5 rounded-3xl drop-shadow-lg">
                    <label>
                        {editFormdata.photo ? editFormdata.photo.name : "Upload Category Photo"}
                        <input type="file" name="photo" accept="image/*" onChange={editChangeHandler} hidden />
                    </label>
                </div>

                <button onClick={editCategory} className="w-72 p-2 border-2 rounded-3xl bg-blue-500 font-bold text-white">Edit</button>
                </div>
            </div>
            : <></>
        }
        

        </Layout>
    );
};

export default ManageCategories;