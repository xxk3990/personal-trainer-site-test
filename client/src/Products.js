import React  from 'react';
import { useState, useEffect, useRef } from 'react';
import { handleGet, handlePost } from './services/requests-service';
import './styles/products.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        imageURL: '',
        price: 0
    })
    const file = useRef(null);
    const getProducts = async () => {
        const endpoint = `allProducts`
        handleGet(endpoint, setProducts)
    }
    useEffect(() => {
        document.title = "Admin Products"
        getProducts()
    }, []);

    const handleChange = (name, value) => {
        setNewProduct({...newProduct, [name]:value})
    }
    const handleUpload = (inputName, path, value) => {
        const imgLink = URL.createObjectURL(path)
        console.log(imgLink);
        newProduct.imageURL = imgLink
        handleChange(inputName, value);
    }
    const postProduct = async() => {
        const endpoint = `addProduct`;
        const requestBody = {
            product_name: newProduct.productName,
            image_url: newProduct.imageURL,
            price: newProduct.price
        }
        try {
            const response = await handlePost(endpoint, requestBody)
            const data = await response.json()
            if(response.status === 200 || response.status === 201) {
                setProducts([...products, data])
                setNewProduct({
                    productName: '',
                    imageURL: '',
                    price: 0
                })
                getProducts();
                if(file.current) {
                    file.current.value = null;
                }

            } else {
                alert("An Error occurred during product creation.")
            }
        } catch {
            alert("An Error occurred during product creation.")
        }
    }
    if(products.length === 0) {
      return (
        <div className='Products'>
            <h4>No products yet!</h4>
            <section className='add-product'>
                <span className='product-form-question' id="productname">Product Name: <input type="text" className='user-input' name="productName" value={newProduct.productName} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                <span className='product-form-question' id="productimageUrl">Product Image: <input type="file" className='user-input' id="product-img-upload" ref={file} name="imageURL" value={newProduct.imageURL} onChange={e => handleUpload(e.target.name, e.target.files[0], e.target.value)} required/></span>
                <span className='product-form-question' id="productprice">Product Price: <input type="number" min="0" max="2500" className='user-input' name="price" value={newProduct.price} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                <button type='button' onClick={postProduct}>Submit</button>
            </section>
        </div>
      )  
    } else {
        return (
            <div className='Products'>
                <h1>All products</h1>
                <section className='products-grid'>
                    {products.map(p => {
                        return <Product p={p}/>
                    })}
                </section>
                <section className='add-product'>
                    <span className='product-form-question' id="productname">Product Name: <input type="text" className='user-input' name="productName" value={newProduct.productName} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                    <span className='product-form-question' id="productimageUrl">Product Image: <input type="file" className='user-input' id="product-img-upload" name="imageURL" ref={file} onChange={e => handleUpload(e.target.name, e.target.files[0], e.target.value)} required/></span>
                    <span className='product-form-question' id="productprice">Product Price: <input type="number" min="0" max="2500" className='user-input' name="price" value={newProduct.price} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                    <button type='button' onClick={postProduct}>Submit</button>
                </section>
            </div>
        )
    }
}

const Product = (props) => {
    const p = props.p;
    return (
        <section className="product-info">
            <h3 id="productname">{p.product_name}</h3>
            <p>${p.price}</p>
        </section>
    )
}