import { ArrowBackIosNewRounded,  } from "@mui/icons-material";
import { BottomNavigation, Hidden, Paper } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, } from "react-router-dom";




export default function Topcard(props) {

    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    return (
    // <div className="heading">
    <Hidden mdUp>
       <Paper sx={{ position: 'fixed', Top: 0, left: 0, right: 0, backgroundColor:"rgba(241, 255, 249, 0.75)" }} elevation={3}>
           <BottomNavigation
             style={{
                 display: 'flex',
                 backgroundColor:' transparent',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 paddingLeft: 20
             }}
             value={value}
             onChange={(event, newValue) => {
             setValue(newValue);   
             }}
           >
             <Link onClick={navigate(-1)} ><ArrowBackIosNewRounded/></Link>
             <p className="heading" style={{fontSize:40}}>{props.name}</p>
         </BottomNavigation>
       </Paper>
   </Hidden>
//    </div>
);
}

