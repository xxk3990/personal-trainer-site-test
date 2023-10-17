import React  from 'react';
import { useState, useEffect} from 'react';
import { handleGet, handlePost } from './services/requests-service';
import './styles/products.css';
import { Snackbar } from '@mui/material';
import { integerTest, addDecimal } from './util-methods';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        imageURL: '',
        price: 0
    })
    const getProducts = async () => {
        const url = `allProducts`
        await fetch(url, {
            method: 'GET',
        }).then(response => response.json(),
        []).then(responseData => {
            if(responseData.length === 0) {
                setProducts([]);
            } else {
                setProducts(responseData); //set it equal to data from API
            }
            
        })
    }
    useEffect(() => {
        document.title = "Admin Products"
        getProducts()
    }, []);

    const handleChange = (name, value) => {
        setNewProduct({...newProduct, [name]:value})
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
                getProducts();
                setOpenSnackbar(true);
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setNewProduct({
                        productName: '',
                        imageURL: '',
                        price: 0
                    })
                }, 1500)

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
            <Snackbar open={openSnackbar} autoHideDuration={1500} message="Product Added Successfully!" anchorOrigin={{horizontal: "center", vertical:"top"}}/>
            <h4>No products yet!</h4>
            <section className='add-product'>
                <span className='product-form-question' id="productname">Product Name: <input type="text" className='user-input' name="productName" value={newProduct.productName} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                <span className='product-form-question' id="productimageUrl">Product Image: <input type="text" className='user-input' id="product-img" name="imageURL" value={newProduct.imageURL} onChange={e => handleChange(e.target.name, e.target.value)} required placeholder='Please paste a proper link.'/></span>
                <span className='product-form-question' id="productprice">Product Price: <input type="number" min="0" max="2500" className='user-input' name="price" value={newProduct.price} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                <button type='button' onClick={postProduct}>Submit</button>
            </section>
        </div>
      )  
    } else {
        return (
            <div className='Products'>
                <Snackbar open={openSnackbar} autoHideDuration={1500} message="Product Added Successfully!" anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                <h1>All products</h1>
                <section className='products-grid'>
                    {products.map(p => {
                        return <Product p={p}/>
                    })}
                </section>
                <section className='add-product'>
                    <span className='product-form-question' id="productname">Product Name: <input type="text" className='user-input' name="productName" value={newProduct.productName} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                    <span className='product-form-question' id="productimageUrl">Product Image: <input type="text" className='user-input' id="product-img" name="imageURL" onChange={e => handleChange(e.target.name, e.target.value)} required placeholder='Please paste a proper link.'/></span>
                    <span className='product-form-question' id="productprice">Product Price: <input type="number" min="0" max="2500" className='user-input' name="price" value={newProduct.price} onChange={e => handleChange(e.target.name, e.target.value)} required/></span>
                    <button type='button' onClick={postProduct}>Submit</button>
                </section>
            </div>
        )
    }
}

const Product = (props) => {
    const p = props.p;
    const formattedPrice = addDecimal(p.price);
    const isInt = integerTest(Number(p.price / 100));
    const price = isInt === true ? p.price : formattedPrice;
    return (
        <section className="product-info">
            <h3 id="productname">{p.product_name}</h3>
            <img className="product-list-img" src = {p.image_url} alt = {p.product_name}/>
            <p>${price}</p>
        </section>
    )
}