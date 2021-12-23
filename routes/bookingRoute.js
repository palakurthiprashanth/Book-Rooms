const express = require("express");
const moment = require("moment");
const stripe = require("stripe")("sk_test_51K9YmiSCa2EMkQEEtHHQ971MDsYs1yFQQXsK41CaLkFav91TAduKP127JdhILeJaBFZ5d1Yues017HXRaXFAeLkh0062o57kGc");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Booking = require("../models/booking");
const Room = require("../models/room");

router.post('/bookroom', async (req, res) => {
    const { room, fromdate, todate, totaldays, totalamount, userid, token } = req.body;
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                currency: "inr",
                customer: customer.id,
                receipt_email: token.email,
            },
            {
                idempotencyKey: uuidv4(),
            }
        );
        if (payment) {
            console.log("payment");
            const newbooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromdate: fromdate,
                todate: todate,
                totalamount,
                totaldays,
                transactionId: '12345'
            });
            const booking = await newbooking.save();
            console.log("booking", booking._id);
            const roomTemp = await Room.findOne({ id: room._id });
            roomTemp.currentbookings.push({
                bookingid: booking._id,
                fromdate,
                todate,
                userid,
                status: booking.status
            });
            await roomTemp.save();
        }
        res.status(200).send("your room is booked.");
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
    }
});

router.post("/getuserbookings", async (req, res) => {
    const { userid } = req.body;
    try {
      const bookings = await Booking.find({ userid: userid }).sort({ _id: -1 });
      res.send(bookings);
    } catch (error) {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
 
  router.post("/cancelbooking", async (req, res) => {
    const {bookingid,roomid } = req.body;
    
  
    try {
  
      const bookingitem = await Booking.findOne({_id: bookingid}) 
      bookingitem.status='cancelled'
      await bookingitem.save();
      const room = await Room.findOne({_id:roomid})
      const bookings = room.currentbookings
      const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
      console.log(temp);
      room.currentbookings=temp;
      await room.save()
  
      res.send('Booking deleted successfully')
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "something went wrong" });
    }
  });
 
  router.get("/getallbookings", async (req, res) => {
    try {
      const bookings = await Booking.find({});
      res.send(bookings);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

module.exports = router;
