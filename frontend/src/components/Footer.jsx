import React from "react";

const Footer=()=> {

    return(
        <footer class="bg-amber-500">
        <div class="flex justify-center items-center">
         <div class="flex justify-between"> 
        <div class="grid grid-cols-3 my-10  gap-10 max-w-screen-lg h-auto">
           <div class="col-span-1">
            <h3>About Us</h3>
            <p><a href="">S-MART</a></p>
           </div>

           <div class="col-span-1 ml-0">
            <h1>Founder</h1>
           <ul>
            <li>Jebisha Bariya</li>
            <li>Kristina Bhatta</li>
            <li>Melina Pomu</li>
            <li>Sylvia Thapa</li>
           </ul>
           </div>

           <div class="col-span-1 ml-0">
            <h1>Contact </h1>
            <ul>
                <li>Jebi@ku.edu.np</li>
                <li>Kris@ku.edu.np</li>
                <li>Me@ku.edu.np</li>
                <li>Sylvia@ku.edu.np</li>
            </ul>
           </div>
        </div> 
    </div>
</div>  
 </footer>
  
    )
}
export default Footer;