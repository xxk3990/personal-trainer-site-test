import "../../styles/shopping-cart.css"
import { addDecimal } from "../../util-methods";
export const CartItem = (props) => {
    const {
        ci, 
        decreaseCartItem, 
        addCartItem, 
        submitCartDelete
    } = props;
    const handleDecrease = () => {
        decreaseCartItem(ci);
    }
    const handleIncrease = () => {
        addCartItem(ci);
    }
    const handleDelete = () => {
        submitCartDelete(ci);
    }
    return (
        <section key={ci.uuid} className='cart-item-li'>
            <span>{ci.quantity}</span>
            <span>{ci.product_name}</span>
            {/* <img className="img-in-cart" src = {ci.image_url} alt={ci.product_name}/> */}
            <span>{addDecimal(ci.item_total)}</span>
            <footer className='cart-item-footer'>
                <button type="button" className='item-btn' onClick={handleIncrease}> + </button>
                <button type="button" className='item-btn' onClick={handleDecrease}> – </button>
                <button type="button" className='item-btn' onClick={handleDelete}> Delete </button>
            </footer>
        </section>
    )
}