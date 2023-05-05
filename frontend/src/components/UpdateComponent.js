import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';


const UpdateProduct = () => {
    const[name,setName]= React.useState('');
    const[price,setPrice]= React.useState('');
    const[category,setCategory]= React.useState('');
    const[company,setCompany]= React.useState(''); 
    const params = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        getProductDetails();
    }, [] )

    const getProductDetails = async () => {
        console.warn(params);
        let result = await fetch(`http://localhost:4000/product/${params.id}` ,{
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result = await result.json();
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
    }

    const updateProduct = async () => {
         console.warn(name,price,category,company)
         let result = await fetch(`http://localhost:4000/product/${params.id}`, {
            method: 'Put',
            body: JSON.stringify({name,price,category,company}),
            headers:{ 
                "Content-Type" : "application/json",
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            }

         });
         result = await result.json();
         console.warn(result)
         navigate('/')
    }

    return(
        <div className='product'>
            <h1>Update Product</h1>
            <input type="text" placeholder='Enter Product name' className='inputBox'
            value = {name} onChange = {(e) => {setName(e.target.value)}}
            />
            

            <input type="text" placeholder='Enter Product price' className='inputBox'
            value = {price} onChange = {(e) => {setPrice(e.target.value)}}
            /> 
            
            <input type="text" placeholder='Enter Product category' className='inputBox'
            value = {category} onChange = {(e) => {setCategory(e.target.value)}}
            />
           

            <input type="text" placeholder='Enter Product company' className='inputBox' 
            value = {company} onChange = {(e) => {setCompany(e.target.value)}}
            />
             
            <button onClick={updateProduct} className='appButton'>Update Product</button>
        </div>
    )
}

export default UpdateProduct;