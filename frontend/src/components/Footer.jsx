import React from "react";

const Footer = () => {
    return (
        <footer className="bg-brown-600">
            <div className="flex justify-center items-center">
                <div className="flex justify-between">
                    <div className="grid grid-cols-3 my-10 gap-10 max-w-screen-lg h-auto">
                        <div className="col-span-1">
                            <h3 className="text-white">About Us</h3>
                            <p><a href="" className="text-brown-200 hover:underline">S-MART</a></p>
                        </div>

                        <div className="col-span-1 ml-0">
                            <h1 className="text-white">Founder</h1>
                            <ul className="text-white">
                                <li>Jebisha Bariya</li>
                                <li>Kristina Bhatta</li>
                                <li>Melina Pomu</li>
                                <li>Silviya Thapa</li>
                            </ul>
                        </div>

                        <div className="col-span-1 ml-0">
                            <h1 className="text-white">Contact</h1>
                            <ul className="text-white">
                                <li><a href="mailto:Jebi@ku.edu.np" className="hover:underline">Jebi@ku.edu.np</a></li>
                                <li><a href="mailto:Kris@ku.edu.np" className="hover:underline">Kris@ku.edu.np</a></li>
                                <li><a href="mailto:Me@ku.edu.np" className="hover:underline">Me@ku.edu.np</a></li>
                                <li><a href="mailto:Silviya@ku.edu.np" className="hover:underline">Silviya@ku.edu.np</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
