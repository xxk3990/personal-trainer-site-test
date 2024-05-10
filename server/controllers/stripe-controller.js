const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripePublic = process.env.STRIPE_PUB_KEY;


const stripe = require("stripe")(stripeSecret)
const models = require('../models');
const loadCheckout = async (req, res) => {
    const customer = await stripe.customers.create({
        metadata: {
            user_uuid: req.query.user_uuid,
            order_uuid: req.body.order_uuid,
            order_date: new Date(req.body.order_date).toISOString()
        }
    })
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
            customer: customer.id,
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/userOrders`,
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

const stripeWebhook = async (req, res) => {
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    data = event.data.object;
    eventType = event.type;

    if (eventType === "checkout.session.completed") {
        stripe.customers.retrieve(data.customer).then(async customer => {
            console.log('customer:', customer)
            console.log("data", data)
            //update order to completed = true on payment success
            const orderToUpdate = await models.Order.findOne(({
                where: {
                    'uuid': customer.metadata.order_uuid,
                    "user_uuid": customer.metadata.user_uuid
                },
            }))
            orderToUpdate.completed = true;
            orderToUpdate.order_date = customer.metadata.order_date;
            await orderToUpdate.save();

        }).catch(err => console.log(err.message))
    }





    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send();
}


module.exports = {
    loadCheckout,
    stripeWebhook
}