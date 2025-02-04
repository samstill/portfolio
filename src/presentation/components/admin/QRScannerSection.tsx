import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCamera } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import QRScanner from '../QRScanner';
import { ticketService } from '../../../firebase/services/ticketService';
import { Ticket } from '../../../domain/entities/Ticket';

const QRScannerWrapper = styled(motion.div)`
  width: 100%;
  margin: 20px auto;
  max-width: 600px;
`;

const QRScannerButton = styled(motion.button)<{ $isScanning: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 30px);
  margin: 20px auto;
  padding: 16px;
  background: ${props => props.$isScanning ? 
    'rgba(244, 67, 54, 0.2)' : 
    'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  color: ${props => props.$isScanning ? '#F44336' : 'white'};
  border: ${props => props.$isScanning ? '1px solid #F44336' : 'none'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: ${props => props.$isScanning ? 
    '0 4px 12px rgba(244, 67, 54, 0.2)' : 
    '0 4px 12px rgba(74, 108, 247, 0.2)'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isScanning ? 
      'rgba(244, 67, 54, 0.3)' : 
      'linear-gradient(135deg, #4a6cf7, #6e8efb)'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: calc(100% - 30px);
    margin: 15px auto;
    padding: 14px;
    font-size: 0.95rem;
  }
`;

const ScannerSection = styled(motion.div)`
  width: 100%;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  position: relative;
`;

const ScannerContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Makes it square */
  background: #000;
  overflow: hidden;

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
  }
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ScannerFrame = styled.div`
  width: 70%;
  height: 70%;
  border: 2px solid rgba(74, 108, 247, 0.5);
  border-radius: 20px;
  position: relative;

  &:before, &:after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-color: #4a6cf7;
    border-style: solid;
  }

  /* Top left corner */
  &:before {
    top: -2px;
    left: -2px;
    border-width: 3px 0 0 3px;
    border-radius: 10px 0 0 0;
  }

  /* Bottom right corner */
  &:after {
    bottom: -2px;
    right: -2px;
    border-width: 0 3px 3px 0;
    border-radius: 0 0 10px 0;
  }
`;

const ScannerCorners = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  &:before, &:after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-color: #4a6cf7;
    border-style: solid;
  }

  /* Top right corner */
  &:before {
    top: -2px;
    right: -2px;
    border-width: 3px 3px 0 0;
    border-radius: 0 10px 0 0;
  }

  /* Bottom left corner */
  &:after {
    bottom: -2px;
    left: -2px;
    border-width: 0 0 3px 3px;
    border-radius: 0 0 0 10px;
  }
`;

const ScanLine = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(74, 108, 247, 0) 0%, 
    rgba(74, 108, 247, 0.5) 50%, 
    rgba(74, 108, 247, 0) 100%
  );
`;

interface QRScannerSectionProps {
  onTicketFound: (ticket: Ticket) => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({ onTicketFound }) => {
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);

  const handleScan = async (data: string | null) => {
    if (!data) return;

    try {
      // Parse the QR code data
      const qrData = JSON.parse(data);
      
      if (!qrData.ticketId) {
        toast.error('Invalid QR code format');
        return;
      }

      const ticket = await ticketService.getTicket(qrData.ticketId);
      
      if (!ticket) {
        toast.error('Ticket not found');
        return;
      }

      // Check ticket status
      if (ticket.status === 'used') {
        toast.error('Ticket has already been used', {
          duration: 3000,
          icon: '⚠️'
        });
        return;
      }

      if (ticket.status === 'cancelled') {
        toast.error('Ticket has been cancelled', {
          duration: 3000,
          icon: '❌'
        });
        return;
      }

      // Close scanner and notify parent
      setIsScannerOpen(false);
      onTicketFound(ticket);

      // Show success toast
      toast.success('Ticket found! Please validate below.', {
        duration: 3000,
        icon: '✅'
      });

    } catch (error) {
      console.error('Error scanning ticket:', error);
      toast.error('Invalid QR code', {
        duration: 3000,
        icon: '❌'
      });
    }
  };

  return (
    <QRScannerWrapper>
      <QRScannerButton
        onClick={() => setIsScannerOpen(!isScannerOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        $isScanning={isScannerOpen}
      >
        <FiCamera size={20} />
        {isScannerOpen ? 'Stop Scanning' : 'Scan Ticket QR Code'}
      </QRScannerButton>

      {isScannerOpen && (
        <ScannerSection
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ScannerContainer>
            <QRScanner
              onScan={handleScan}
              onError={(error) => {
                if (!error.includes('No QR code found')) {
                  toast.error('Camera error. Please try again.');
                }
              }}
            />
            <ScannerOverlay>
              <ScannerFrame>
                <ScannerCorners />
                <ScanLine
                  animate={{
                    y: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </ScannerFrame>
            </ScannerOverlay>
          </ScannerContainer>
        </ScannerSection>
      )}
    </QRScannerWrapper>
  );
};

export default QRScannerSection; 