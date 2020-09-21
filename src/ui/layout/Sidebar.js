import React, { useContext } from 'react'
import '../../App.css'

export function openNav() {
    document.getElementById("mySidepanel").style.width = "350px";
}

export function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
} 

const Sidebar = (props) => {     

    return (
        <div>           
            <div id="mySidepanel" class="sidepanel">
                <button class='closebtn' onClick={closeNav}>X</button>                
            </div>
        </div>
    )
}

export default Sidebar



