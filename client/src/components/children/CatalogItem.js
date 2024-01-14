import "../../styles/shopping-cart.css";
import { addDecimal } from "../../util-methods";

//this is each product in the shopping cart product catalog.
export const CatalogItem = (props) => {
    const {
        p, 
        addCartItem
    } = props;
    const item = {
        product_name: p.product_name,
        product_uuid: p.uuid,
        price: p.price,
        image_url: p.image_url,
        quantity: 1
    }
    const handleClick = () => {
        //call parent "add to cart" method with child's unique product info
        addCartItem(item);
    }
    return (
        <section key={p.uuid} className="product-info">
          <h3 id="productname">{p.product_name}</h3>
          <p>${addDecimal(p.price)}</p>
          <img className="product-img-brochure" src = {p.image_url} alt={item.product_name}/>
          <button type="button" className='add-to-order-btn' onClick={handleClick}>Add to Cart</button>
        </section>
    )
}