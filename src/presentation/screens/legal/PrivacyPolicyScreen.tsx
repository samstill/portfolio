import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyScreen: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
            Privacy Policy
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              1. Information We Collect
            </Typography>
            <Typography paragraph>
              We collect information that you provide directly to us, including:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Personal identification information (name, email address, phone number)<br />
              • Payment information (processed securely through our payment providers)<br />
              • Account preferences and settings<br />
              • Transaction and booking history
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              2. How We Use Your Information
            </Typography>
            <Typography paragraph>
              We use the collected information for:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Processing your ticket purchases and bookings<br />
              • Sending important notifications about events<br />
              • Improving our services and user experience<br />
              • Preventing fraud and maintaining security
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              3. Information Sharing
            </Typography>
            <Typography paragraph>
              We do not sell or rent your personal information to third parties. We may share your information with:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Event organizers (limited to necessary booking information)<br />
              • Payment processors for transaction processing<br />
              • Service providers who assist in our operations
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              4. Data Security
            </Typography>
            <Typography paragraph>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              5. Your Rights
            </Typography>
            <Typography paragraph>
              You have the right to:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Access your personal information<br />
              • Correct inaccurate information<br />
              • Request deletion of your information<br />
              • Opt-out of marketing communications
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              6. Cookies and Tracking
            </Typography>
            <Typography paragraph>
              We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.
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

export default PrivacyPolicyScreen; 