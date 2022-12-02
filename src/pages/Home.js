import { Avatar, Card, CardContent,Chip,Container,Hidden } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EastIcon from '@mui/icons-material/East';
import { Link, useNavigate } from "react-router-dom";
import Ekka from "../images/ekka.jpg";
import { ArrowForwardIos } from "@mui/icons-material";
import "./home.css"



function Home() {
    const navigate = useNavigate();

    return ( 
        <Container sm={12}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",height: '40px', margin:"10px",width: '100%'}}>
            <a href="#" style={{ marginLeft:"3%" ,letterSpacing:6}} className="link">
                
                SAMSTILL
            </a>
            <a href="https://blog.harshitpadha.studio" style={{ marginRight:"3%" ,letterSpacing:4}} className="link">
                Blog.
            </a>
        </div>
        <Grid container spacing={2} xs={12}>
            <Grid item paddingTop={15} display="flex" justifyContent="center" alignItems="center" xs={12} md={6}>
                    <p>
                    <p className="heading typewriter" style={{letterSpacing:14}}>
                        Hello!
                    </p>
                        <p className="subheading">
                            <p className="subheading blink-2">
                                Welcome to the Lifestyle.
                            </p>
                        </p>
                    </p>
            
            </Grid>
{/* large screen card  */}
            <Hidden Grid item mdDown>

                <Grid item paddingTop={5} display="flex" justifyContent="center">
                    <Card className="slit-in-vertical" sx={{borderRadius: 10, backgroundColor:"#f1fff9" }}>
                        <CardContent style={{display:"flex",justifyContent:"space-between",paddingLeft:50,paddingRight:50,backgroundColor:"transparent"}}>
                            <a href="https://instagram.com/samstill_1">
                                    <InstagramIcon style={{backgroundColor:"transparent"}} />
                            </a>
                            <a href="https://twitter.com/samstill_1">
                                    <TwitterIcon style={{backgroundColor:"transparent"}} />
                            </a>
                            <a href="https://www.linkedin.com/in/harshitpadha/">
                                    <LinkedInIcon style={{backgroundColor:"transparent"}} />
                            </a>
                        </CardContent>
                        <CardContent style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
                            My Spotify Playlist <EastIcon  />
                        </CardContent>
                        <CardContent style={{display:"flex",paddingLeft:32,paddingRight:32,backgroundColor:"transparent"}}>
                            <div style={{backgroundColor:"transparent", width:"100%",height:250}}>
                            
                                <iframe style={{borderRadius:12}} src="https://open.spotify.com/embed/playlist/5EArvUqjXJSG2PV5WXaIts?utm_source=generator" width="100%" height="250" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                            </div>
                        </CardContent>

                        <CardContent style={{backgroundColor:"transparent"}}>
                            <div style={{position: "absolute",
                                            paddingBottom: "10px",
                                            width: "270px",
                                            height: "38px",
                                            background: "transparent",
                                            display:"flex",
                                            justifyContent:"space-between",
                                            alignItems:"center",
                                            borderRadius: 19}}>
                                                    <div></div>
                                                    <Link to="/About" className="subheading" style={{paddingLeft:"30px",letterSpacing:5}}>About Me</Link>

                                                <EastIcon style={{backgroundColor:"transparent"}} />
                                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                
            </Hidden>
        </Grid>

{/* Small screen card */}
            <Hidden Grid item mdUp>
                <Grid className="fade-in-top" item paddingTop={3} display="flex" justifyContent="center">
                    <Card sx={{minWidth: 310 , minHeight:50, borderRadius: 10, display:"flex", justifyContent:"space-between", alignItems:"center", backgroundColor:"#f1fff9" }} >
                        <CardContent style={{backgroundColor:"transparent"}}>
                            <Chip padding={5} avatar={<Avatar src={<Ekka/>} />} onClick={() => navigate('/about')} label="About me" />

                        </CardContent> 

                        <CardContent style={{backgroundColor:"transparent"}}>
                            <ArrowForwardIos />
                        </CardContent>
                                        
                    
                        <CardContent  style={{backgroundColor:"transparent"}}>
                                <a href="https://instagram.com/samstill_1">
                                        <InstagramIcon/>
                                </a>
                                <a href="https://twitter.com/samstill_1">
                                        <TwitterIcon/>
                                </a>
                                <a href="https://www.linkedin.com/in/harshitpadha/">
                                        <LinkedInIcon/>
                                </a>
                        </CardContent>
                    
                    </Card>  
                
                    

                </Grid>
            </Hidden>
            <Grid>
                
            </Grid>
        </Container>
     );
}

export default Home;