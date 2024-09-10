import React,{ useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import AdminMenu from "../../components/layouts/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProducts = () => {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [photo, setPhoto] = useState("");
    const [shipping, setShipping] = useState("");

    const navigate = useNavigate();

    const getCategories = async () => {
        try{
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-categories`);

            if(res.data.success){
                setCategories(res.data.categories);
            }
            else{
                toast.error(res.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error('Something Went Wrong.');
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const createProduct = async (e) => {
        e.preventDefault();

        try{
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("discount", discount);
            formData.append("category", category);
            formData.append("quantity", quantity);
            formData.append("photo", photo);
            formData.append("shipping", shipping);

            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, formData);
          
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/dashboard/admin/manage-products");
            }
            else{
                toast.error(res.data.message);
            }
        }
        catch(error){
            console.log(error);
            toast.error('Something Went Wrong.');
        }
    };

    return (
        <Layout title={'EcomSite - Create Products'}>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="card m-3 p-3">
                            <h4>Create Product</h4>
                            {/* <form onSubmit={createProduct}> */}
                                <div className="mb-3">
                                    <input type="text" className="form-control" placeholder="Enter a Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <textarea className="form-control" placeholder="Enter a Description" value={description} onChange={(e) => setDescription(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <input type="number" className="form-control" placeholder="Enter a Price" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <input type="number" className="form-control" placeholder="Enter a Discount" value={discount} onChange={(e) => setDiscount(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <select className="form-select" aria-label="Default select example" onChange={(e) => setCategory(e.target.value)} value={category}>
                                        <option value="" disabled hidden>Choose a Category</option>
                                        {categories?.map((category) => (<option key={category._id} value={category._id}>{category.name}</option>))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <input type="number" className="form-control" placeholder="Enter a Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <label className="btn btn-outline-secondary col-md-12">
                                        {photo ? photo.name : "Upload Photo"}
                                        <input type="file" name="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                    </label>
                                </div>
                                <div className="mb-3">
                                    {photo && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt='Product_Photo' height={'200px'} className="img img-responsive" />
                                    </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <select className="form-select" aria-label="Default select example" onChange={(e) => setShipping(e.target.value)} value={shipping}>
                                        <option value="" disabled hidden>Choose a shipping</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <button onClick={createProduct} className="btn btn-primary">Create Product</button>
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProducts; 