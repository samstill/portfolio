import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { BottomNavigation,  Grid, Hidden, Paper} from "@mui/material";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import "./studio.css";




function Studio() {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    return ( 
    <>
     
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
                <ArrowBackIosNewRounded onClick={navigate(-1)}  />
                <p className="heading" style={{fontSize:40}}>Studio</p>
            </BottomNavigation>
          </Paper>
      </Hidden>

      {/* background */}
      <Grid container  sx={{background: "#0F2027",  /* fallback for old browsers */background: "-webkit-linear-gradient(to right, #2C5364, #203A43, #0F2027)" , /* Chrome 10-25, Safari 5.1-6 */background: "linear-gradient(to right, #2C5364, #203A43, #0F2027)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */}}>
               
     
      <Grid item display="flex" justifyContent="center" alignItems="center" xs={12}>
                
      </Grid>
      </Grid>
    </>
     );
}

export default Studio;