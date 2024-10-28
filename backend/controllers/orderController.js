import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import Razorpay from 'razorpay';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_nIT3Ju4iKvnjNr',
    key_secret: 'U1VqA3DM2R9eiROVM33zGyIM'
})

// placing user order from frontend
const placeOrder = async (req,res) => {
    const RAZORPAY_KEY_ID = 'rzp_test_nIT3Ju4iKvnjNr'
    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        const options = {
            amount: req.body.amount * 100, // Amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        };
        
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "ron", // Change this if INR is the intended currency
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80  // Multiplied with 80 for some reason?
            },
            quantity: item.quantity
        }));
        
        


        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: options.amount,  // Update this line
                    key_id: RAZORPAY_KEY_ID,  // Use env variables for security
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: "8567345632",
                    name: "Sandeep Sharma",
                    email: "sandeep@gmail.com",
                    session_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`
                });
            } else {
                res.status(400).send({ success: false, msg: 'Something went wrong!' });
            }
        });
        

        // const session = await stripe.checkout.sessions.create({
        //     line_items:line_items,
        //     mode:'payment',
        //     success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        //     cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        // })

        // res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// user orders for frontend

const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}