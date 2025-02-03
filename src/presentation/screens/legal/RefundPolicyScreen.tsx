import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const RefundPolicyScreen: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
            Refund Policy
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              1. Refund Eligibility
            </Typography>
            <Typography paragraph>
              We understand that circumstances may arise requiring you to request a refund. Please review our refund eligibility criteria:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Cancellation within 24 hours of purchase: Full refund<br />
              • Event cancellation by organizer: Full refund<br />
              • Event rescheduling: Option for refund or transfer<br />
              • Technical payment issues: Full refund
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              2. Refund Process
            </Typography>
            <Typography paragraph>
              To request a refund:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              1. Log into your account<br />
              2. Navigate to your tickets/orders<br />
              3. Select the ticket for refund<br />
              4. Submit refund request with reason
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              3. Processing Time
            </Typography>
            <Typography paragraph>
              • Refund requests are typically processed within 5-7 business days<br />
              • Credit card refunds may take additional 3-5 business days to appear<br />
              • Bank transfer refunds may take 5-10 business days
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              4. Non-Refundable Items
            </Typography>
            <Typography paragraph>
              The following are generally non-refundable:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Booking fees and service charges<br />
              • Shipping fees (if applicable)<br />
              • Insurance charges<br />
              • Tickets purchased as "Non-Refundable"
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              5. Special Circumstances
            </Typography>
            <Typography paragraph>
              We may consider refunds in special circumstances:
            </Typography>
            <Typography component="div" sx={{ pl: 2 }}>
              • Medical emergencies (with documentation)<br />
              • Natural disasters affecting event attendance<br />
              • Technical failures preventing event access
            </Typography>

            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
              6. Contact Support
            </Typography>
            <Typography paragraph>
              For additional assistance with refunds, please contact our support team through the help center or support email.
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

export default RefundPolicyScreen; 