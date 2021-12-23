import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import StripeCheckout from 'react-stripe-checkout';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({
    duration:'2000'
});

const BookingScreen = ()=> {
    const [room, setRoom]= useState([]);
    const [loading, setloading]= useState(true);
    const [error, setError]= useState();
    let { roomid, fromdate, todate } = useParams();
    const [totalamount, settotalamount]= useState();
    const [totaldays, settotaldays]= useState();
    const startDate= moment(fromdate, 'DD-MM-YYYY');
    const endDate= moment(todate, 'DD-MM-YYYY');
    const totalDays= moment.duration(endDate.diff(startDate)).asDays()+1;
    useEffect(async()=> {
        try {
            setloading(true);
            const data= (await axios.post('/api/rooms/getroombyid', { roomid })).data;
            const totalDurationDays= moment.duration(endDate.diff(startDate)).asDays()+1;
            settotaldays(totalDurationDays);
            settotalamount(data.rentperday*totalDurationDays);
            setRoom(data);
            setloading(false);
        }catch (error) {
            console.log(error);
            setError(true);
            setloading(false);
        }
    }, []); 
     
    async function onToken(token) {
        console.log(token);
        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        };
        try {
            setloading(true);
            const result= await axios.post('/api/bookings/bookroom', bookingDetails );
            setloading(false);
            Swal.fire('Congrats' , 'Your Room has booked succeessfully' , 'success').then(result=>{
                window.location.href='/profile'
            })
        }catch (error) {
            console.log(error);
            setloading(false)
            Swal.fire('Oops' , 'Something went wrong , please try later' , 'error')
        }
    }

    return <div className= "m-5">
        { loading ? (<Loader/>) : room ? (<div>
            <div className="row justify-content-center mt-5 bs" data-aos="flip-left">
                <div className="col-md-6">
                    <h1>{ room.name }</h1>
                    <img src={room.imageurls[0]} className="bigimg"/>
                </div>
                <div className="col-md-6">
                    <div style= {{ textAlign: 'right' }}>
                        <h1>Booking Details</h1>
                        <hr />
                        <b>
                            <p>Name: { JSON.parse(localStorage.getItem('currentUser')).name }</p>
                            <p>From Date: { fromdate }</p>
                            <p>To Date: { todate } </p>
                            <p>Max Count: { room.maxcount } </p>
                        </b>
                    </div>
                    
                    <div style= {{ textAlign: 'right' }}>
                        <b>
                            <h1>Amount</h1>
                            <hr/>
                            <p>Total Days: { totalDays }</p>
                            <p>Rent per day: { room.rentperday }</p>
                            <p>Total Amount: { totalamount }</p>
                        </b>
                    </div>

                    <div style= {{ float: 'right' }}>
                        <StripeCheckout
                            amount= { totalamount * 100 }
                            token={ onToken}
                            currency="INR"
                            stripeKey="pk_test_51K9YmiSCa2EMkQEEau9SaEgbO7c33p3Noi4P9vTintHWi1PK2z8HHCvyIdpTwN9HVn0ceKB16ZTLeatGRlt2WuOw00HfLyufRd"
                        >
                            <button className="btn btn-primary" >Pay Now</button>
                        </StripeCheckout>    
                    </div>
                </div>
            </div>
        </div>): <Error/>
        }
    </div>
};
export default BookingScreen;
