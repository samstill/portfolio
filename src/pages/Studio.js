import {Grid} from "@mui/material";
import Topcard from "../components/TopCard";
import "./studio.css";




function Studio() {
    return ( 
    <>
     
    {/* for mobile devices */}
      <Topcard name="Studio"/>

      {/* background */}
      <Grid container  sx={{background: "#0F2027",  /* fallback for old browsers */background: "-webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027)" , /* Chrome 10-25, Safari 5.1-6 */background: "linear-gradient(to right, #2C5364, #203A43, #0F2027)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */}}>
               
     
      <Grid item height="900px" color="white" display="flex" justifyContent="center" alignItems="center" xs={12}>
                
                  hello
                
      </Grid>
      </Grid>
    </>
     );
}

export default Studio;