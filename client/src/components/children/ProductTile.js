import {React, useState} from 'react';
import "../../styles/products.css";
import { addDecimal } from '../../util-methods';
export const ProductTile = (props) => {
    const {
        p, 
        submitProductDelete, 
        submitProductUpdate
    } = props;
    const handleDelete = () => {
        submitProductDelete(p);
    }
    const [showEditProduct, setShowEditProduct] = useState(false); //show and hide edit menu
    if(window.screen.width < 600) {
        return (
            <section key={p.uuid} className="product-info">
                <h3 className="product-name">{p.product_name}</h3>
                <section className='product-info-mobile'>
                    {/* <img className="product-list-img" src={p.image_url} alt={p.product_name} /> */}
                    <p>${addDecimal(p.price)}</p>
                    <span className='edit-delete-btns'>
                        <button className='show-hide-edit-btn' onClick={() => setShowEditProduct(!showEditProduct)}>{showEditProduct ? `Close ${String.fromCharCode(8593)}` : `Edit Details ${String.fromCharCode(8595)}`}</button>
                        <button className='show-hide-edit-btn' onClick={handleDelete}>Delete</button>
                    </span>
                </section>
                {/* Below code shows the menu based on the boolean value and passes in the submit update from the parent. */}
                {showEditProduct ? 
                <EditProduct 
                    p = {p} 
                    submitProductUpdate={submitProductUpdate} 
                    showEditProduct={showEditProduct} 
                    setShowEditProduct={setShowEditProduct}
                /> 
                : null}
            </section>
        )
    } else {
        return (
            <section key={p.uuid} className="product-info">
                <h3 className="product-name">{p.product_name}</h3>
                {/* <img className="product-list-img" src={p.image_url} alt={p.product_name} /> */}
                <p>${addDecimal(p.price)}</p>
                <span className='edit-delete-btns'>
                    <button className='show-hide-edit-btn' onClick={() => setShowEditProduct(!showEditProduct)}>{showEditProduct ? `Close ${String.fromCharCode(8593)}` : `Edit Details ${String.fromCharCode(8595)}`}</button>
                    <button className='show-hide-edit-btn' onClick={handleDelete}>Delete</button>
                </span>
                {/* Below code shows the menu based on the boolean value and passes in the submit update from the parent. */}
                {showEditProduct ? 
                <EditProduct 
                    p = {p} 
                    submitProductUpdate={submitProductUpdate} 
                    showEditProduct={showEditProduct} 
                    setShowEditProduct={setShowEditProduct}
                /> 
                : null}
            </section>
        )
    }
    
}

//I had to make this a separate method otherwise the html in it would appear for 
//every item as well as the one I clicked on
const EditProduct = (props) => {
    const p = props.p;
    const submitProductUpdate = props.submitProductUpdate;
    const showEditProduct = props.showEditProduct;
    const setShowEditProduct = props.setShowEditProduct;
    const [updatedProduct, setUpdatedProduct] = useState({
        uuid: p.uuid,
        product_name: p.product_name,
        image_url: p.image_url,
        price: addDecimal(p.price), //allowed here, server will check for decimals and remove em
    })
    const handleChange = (name, value) => {
        setUpdatedProduct({...updatedProduct, [name]:value})
    }
    const submitUpdate = () => {
        //pass in booleans so this element can be hidden on successful update!
        submitProductUpdate(updatedProduct, showEditProduct, setShowEditProduct);
    }
    return ( 
        <section className='product-edit-form'>
            <span className='product-update-display'>
                <h4>Name:</h4>
                <input className='product-update-input' 
                name="product_name" 
                type="text" 
                value={updatedProduct.product_name} 
                onChange={e => handleChange(e.target.name, e.target.value)}/>
            </span>
            <span className='product-update-display'>
                <h4>Image:</h4>
                {/* <input className='product-update-input' 
                name="image_url" 
                type="text" 
                value={updatedProduct.image_url} 
                onChange={e => handleChange(e.target.name, e.target.value)}/> */}
            </span>
            <span className='product-update-display'>
                <h4>Price:</h4>
                <input className='product-update-input' 
                type="text" 
                name="price" 
                value={updatedProduct.price} 
                onChange={e => handleChange(e.target.name, e.target.value)}/>
            </span>
            <button onClick = {submitUpdate}>Submit Changes</button>
        </section>
    )

}