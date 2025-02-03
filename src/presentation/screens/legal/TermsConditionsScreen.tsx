import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const TermsConditionsScreen: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
            Terms & Conditions
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              1. Acceptance of Terms
            </Typography>
            <Typography paragraph>
              By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              2. Event Tickets
            </Typography>
            <Typography paragraph>
              2.1. All tickets purchased through our platform are subject to availability.<br />
              2.2. Tickets are non-transferable unless explicitly stated otherwise.<br />
              2.3. We reserve the right to cancel tickets if fraudulent activity is suspected.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              3. User Accounts
            </Typography>
            <Typography paragraph>
              3.1. You are responsible for maintaining the confidentiality of your account.<br />
              3.2. You agree to provide accurate and complete information when creating an account.<br />
              3.3. We reserve the right to suspend or terminate accounts that violate our terms.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              4. Payment and Refunds
            </Typography>
            <Typography paragraph>
              4.1. All prices are in the displayed currency and include applicable taxes.<br />
              4.2. Refunds are subject to our refund policy.<br />
              4.3. We use secure payment processing systems to protect your financial information.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              5. Intellectual Property
            </Typography>
            <Typography paragraph>
              All content on this website, including but not limited to text, graphics, logos, and software, is our property and is protected by intellectual property laws.
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              6. Limitation of Liability
            </Typography>
            <Typography paragraph>
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
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

export default TermsConditionsScreen; 