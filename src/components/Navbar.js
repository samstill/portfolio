import { AbcOutlined, Camera, FavoriteRounded, Home } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Hidden, makeStyles, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





export default function Navbar() {
   
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
  


    return ( 
        <>

        {/* for mobile  */}
         <Hidden mdUp>
          <Paper sx={{ position: 'fixed',background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(241,255,249,0.4) 0%, rgba(111,120,116,0.7) 54%, rgba(0,0,0,0.9) 100%)", backgroundFilter: "blur(8px)" ,bottom: 9, display:"flex", justifyContent:"center" ,bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation
                style={{
                  backgroundColor: "transparent" 
                }}
                value={value}
                onChange={(event, newValue) => {
                setValue(newValue);
                }}
              >
                <BottomNavigationAction label="Home" onClick={()=> navigate("/")} icon={<Home />} />
                <BottomNavigationAction label="Studio" onClick={()=> navigate("/studio")} icon={<Camera />} />
                <BottomNavigationAction label="Updates" onClick={()=> navigate("/updates")} icon={<AbcOutlined />} />
            </BottomNavigation>
          </Paper>
      </Hidden>

      {/* for pc */}
      <Hidden mdDown>
          <Paper  sx={{ position: 'fixed', backgroundColor:"rgba(241, 255, 249, 0.75)",backgroundFilter: "blur(8px)" ,bottom: 9, display:"flex", justifyContent:"center", width:"50%",left:"25%", backgroundOpacity:0.2 ,borderRadius:50 }} elevation={9}>
              <BottomNavigation
              showLabels
                style={{
                  backgroundColor: "transparent" 
                }}
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction  label="Home" onClick={()=> navigate("/")} icon={<Home />} />
                <BottomNavigationAction label="Studio" onClick={()=> navigate("/studio")} icon={<Camera />} />
                <BottomNavigationAction label="Updates" onClick={()=> navigate("/updates")} icon={<AbcOutlined />} />
            </BottomNavigation>
          </Paper>
      </Hidden>

        </>
     );
}

