import React  from 'react';
import { useState, useEffect} from 'react';
import {handlePost, handlePut, handleDelete } from '../services/requests-service';
import '../styles/products.css';
import { Snackbar } from '@mui/material';
import { ProductTile } from './children/ProductTile';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [newProduct, setNewProduct] = useState({
        productName: '',
        imageURL: '',
        price: 0
    })

    const getProducts = async () => {
        const endpoint = `products`
        const host = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
        const url = `${host}/${endpoint}`
        await fetch(url, {
            method: 'GET',
        }).then(response => response.json(),
        []).then(responseData => {
            if(!responseData) {
                setProducts([]); 
            } else {
                //sort data so updates don't mess with the order of the products in the list
                const sortedCatalog = responseData.sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt))
                setProducts(sortedCatalog) //set it equal to data from API
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

    const submitProduct = async() => {
        const endpoint = `products`;
        const requestBody = {
            product_name: newProduct.productName,
            //image_url: newProduct.imageURL,
            price: newProduct.price,
        }
        try {
            const response = await handlePost(endpoint, requestBody)
            const data = await response.json()
            if(response.status === 200 || response.status === 201) {
                setProducts([...products, data])
                setOpenSnackbar(true);
                setSnackbarMessage("Product added successfully!")
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setNewProduct({
                        productName: '',
                        //imageURL: '',
                        price: 0
                    })
                    setSnackbarMessage("")
                    getProducts();
                }, 1500)

            } else {
                alert("An Error occurred during product creation.")
            }
        } catch {
            alert("An Error occurred during product creation.")
        }
    }

    const submitProductUpdate = async (product, showEditProduct, setShowEditProduct) => {
        const endpoint = `products`
        console.log(product)
        const requestBody = {
            product: product,
        }
        console.log('updated item price:',product.price);
        const response = await handlePut(endpoint, requestBody);
        if(response.status === 200 || response.status === 201) {
            getProducts();
            setOpenSnackbar(true);
            setSnackbarMessage("Product Update Successful!")
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("")
                setShowEditProduct(!showEditProduct); //hide edit product element
                getProducts();
            }, 1500)
        }
    }

    const submitProductDelete = async (prodToDelete) => {
        const endpoint = `products?product=${prodToDelete.uuid}&price=${prodToDelete.price}`
        const response = await handleDelete(endpoint)
        if(response.status === 200) {
            setOpenSnackbar(true);
            setSnackbarMessage("Product Delete Successful!")
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("")
                getProducts();
            }, 1500)
        }
       
    }

    if(products.length === 0) {
      return (
        <div className='Products'>
            <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
            <h4>No products yet!</h4>
            <section className='add-product'>
                <span className='product-form-question'>
                    Product Name: 
                    <input type="text" 
                    className='user-input' 
                    name="productName" 
                    value={newProduct.productName} 
                    onChange={e => handleChange(e.target.name, e.target.value)} required/>
                </span>
                {/* <span className='product-form-question' id="product-image-url">
                    Product Image: 
                </span> */}
                <h5>You do not need to add the .00 for non-decimal prices, the site will do it for you! </h5>
                <span className='product-form-question' id="productprice">Product Price: 
                    <input type="text" 
                    className='user-input' 
                    name="price" 
                    value={newProduct.price} 
                    onChange={e => handleChange(e.target.name, e.target.value)} required/>
                </span>
                <button type='button' onClick={submitProduct}>Submit</button>
            </section>
        </div>
      )  
    } else {
        return (
            <div className='Products'>
                <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={1500} 
                    message={snackbarMessage} 
                    anchorOrigin={{horizontal: "center", vertical:"top"}}
                />
                <h1>All products</h1>
                <section className='products-grid'>
                    {products.map(p => {
                        return <ProductTile key={p.uuid} p={p} submitProductUpdate={submitProductUpdate} submitProductDelete={submitProductDelete}/>
                    })}
                </section>
                <section className='add-product'>
                    <span className='product-form-question'>
                        Product Name: 
                        <input type="text" 
                        className='user-input' 
                        name="productName" 
                        value={newProduct.productName} 
                        onChange={e => handleChange(e.target.name, e.target.value)} required/>
                    </span>
                    {/* <span className='product-form-question' id="productimage_url">
                        Product Image: 
                        <input type="text" 
                        className='user-input' 
                        id="product-img" name="imageURL" 
                        value={newProduct.imageURL} 
                        onChange={e => handleChange(e.target.name, e.target.value)} 
                        required placeholder='Please paste a proper link.'/>
                    </span> */}
                    <h5>You do not need to add the .00 for non-decimal prices, the site will do it for you! </h5>
                    <span className='product-form-question' id="productprice">
                        Product Price: 
                        <input type="text" 
                        className='user-input' 
                        name="price" 
                        value={newProduct.price} 
                        onChange={e => handleChange(e.target.name, e.target.value)} required/>
                    </span>
                    <button type='button' onClick={submitProduct}>Submit</button>
                </section>
            </div>
        )
    }
}

