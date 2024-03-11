const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripePublic = process.env.STRIPE_PUB_KEY;


const stripe = require("stripe")(stripeSecret)

const payWithStripe = async(req, res) => {
    try {
        const line_items = req.body.cart_items.map((item => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product_name,
                        metadata: {
                            id: item.uuid
                        }
                    },
                    unit_amount: Number(Number(((item.item_total / 100) / item.quantity) * 100).toFixed(2))
                },
                quantity: item.quantity
            }
        }))
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/orders`,
            cancel_url: `${process.env.CLIENT_URL}/shoppingCart`
        })
        return res.status(200).json({
            success: true,
            url: session.url
        })
    } catch {
        return res.status(400).json({
            success: false
        })
    }
    
}

module.exports = {payWithStripe}