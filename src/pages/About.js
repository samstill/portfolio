import { ArrowBackIosNewRounded,  } from "@mui/icons-material";
import { BottomNavigation, Hidden, Paper } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, } from "react-router-dom";

function About() {
  
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    return ( 
        <>
            <div className="heading">
            
     
     {/* for mobile devices */}
 
     <Hidden Grid mdUp>
           <Paper sx={{ position: 'fixed', Top: 0, left: 0, right: 0 }} elevation={3}>
               <BottomNavigation
                 style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     paddingLeft: 20
                 }}
                 value={value}
                 onChange={(event, newValue) => {
                 setValue(newValue);   
                 }}
               >
                 <ArrowBackIosNewRounded onClick={navigate(-1)} />
                 <p className="heading" style={{fontSize:40}}>About</p>
             </BottomNavigation>
           </Paper>
       </Hidden>
     
            </div>
        </>
     );
}

export default About;