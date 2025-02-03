import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const AboutUsScreen: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
            About Us
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Our Mission
            </Typography>
            <Typography paragraph>
            I’m Harshit Padha, a software engineer passionate about building innovative solutions that make real connections happen. I founded harshitpadha.me to create a seamless way for people to access professionals like me—through event-based ticketing. Whether you’re looking for guidance, collaboration, or meaningful conversations, this platform ensures you can connect with the right expert at the right time. My goal is simple: to break down barriers and make professional access effortless, engaging, and valuable..
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              Who We Are
            </Typography>
            <Typography paragraph>
              We are a team of passionate individuals who believe in the power of live events to bring people together. Our platform combines cutting-edge technology with exceptional customer service to deliver the best ticketing experience possible.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              What We Offer
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Secure and reliable ticket purchasing<br />
              • Easy-to-use event management tools<br />
              • Real-time analytics and reporting<br />
              • 24/7 customer support<br />
              • Mobile-friendly platform<br />
              • Fraud prevention measures
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              Our Values
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Transparency in all operations<br />
              • Customer satisfaction as our priority<br />
              • Innovation in ticketing solutions<br />
              • Security and trust<br />
              • Community engagement
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              Contact Us
            </Typography>
            <Typography paragraph>
              We're always here to help! If you have any questions, suggestions, or concerns, please don't hesitate to reach out to our support team.
            </Typography>

            <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default AboutUsScreen; 