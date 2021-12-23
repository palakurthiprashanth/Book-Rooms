import { Modal, Carousel, Button } from "react-bootstrap";
import { useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from "react-router-dom";
AOS.init({
    duration:'2000'
});

const Room= ({ room, fromdate, todate }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return <div className="row bs" data-aos="fade-up">
            <div className= "col-md-4">
                <img src={ room.imageurls[0]} className="smalling"/>
            </div>
            <div className= "col-md-7">
                <h1>{room.name}</h1>
                <p>Parking , Reception , Free Wifi</p>
                <p>
                <b>Max Count : {room.maxcount}</b>
                </p>
                <p>
                <b>Phonenumber : </b>
                {room.phonenumber}
                </p>
                <p>
                <b>Type : {room.type}</b>
                </p>
                
                <div style={{ float: "right" }}>
                    { (fromdate && todate) && <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
                        <button className="btn btn-dark m-2">Book Now</button>
                    </Link>
                    }
                

                <button className="btn btn-danger m-2" onClick={handleShow}>
                    View Details
                </button>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header>
                <Modal.Title>{ room.name }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel nextLabel="" prevLabel="">
                        {room.imageurls.map((url) => {
                        return (
                            <Carousel.Item>
                            <img
                                src={url}
                                className="d-block w-100 bigimg"
                                style={{ height: "400px" }}
                            />
                            </Carousel.Item>
                        );
                        })}
                    </Carousel>
                    <p>{room.description}</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
};
export default Room;
