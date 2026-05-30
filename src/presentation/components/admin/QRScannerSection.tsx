import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiRefreshCw, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import QRScanner from '../QRScanner';
import { ticketService } from '../../../firebase/services/ticketService';
import { Ticket } from '../../../domain/entities/Ticket';
import { Html5Qrcode } from 'html5-qrcode';

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
  border-radius: 16px;

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #reader {
    width: 100% !important;
    height: 100% !important;
  }

  #reader__scan_region {
    min-height: 300px !important;
    background: #000;
  }

  video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    background: #000;
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

const CameraFlipButton = styled(motion.button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(74, 108, 247, 0.2);
  border: 2px solid rgba(74, 108, 247, 0.5);
  color: #4a6cf7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 108, 247, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
  }
`;

const ScannerMessage = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 0.9rem;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Overlay = styled(motion.div)<{ $type: 'success' | 'error' | 'processing' }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.$type === 'success' ? 'rgba(46, 213, 115, 0.95)' : 
    props.$type === 'error' ? 'rgba(255, 71, 87, 0.95)' : 
    'rgba(0, 0, 0, 0.85)'};
  color: white;
  z-index: 100;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(5px);
`;

const AnimCircle = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

interface QRScannerSectionProps {
  onTicketFound: (ticket: Ticket) => void;
}

const QRScannerSection: React.FC<QRScannerSectionProps> = ({ onTicketFound }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<Array<{ id: string; label: string }>>([]);
  const isTogglingCamera = useRef(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [scanMessage, setScanMessage] = useState('');
  const [scannedTicketInfo, setScannedTicketInfo] = useState<{ title: string; ticketNumber: string; remaining: number } | null>(null);

  const getCameraDevices = useCallback(async () => {
    try {
      console.log('Getting camera devices...');
      const devices = await Html5Qrcode.getCameras();
      console.log('Found cameras:', devices);

      if (devices && devices.length > 0) {
        setAvailableCameras(devices);

        // Try to find a back camera first
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        // If no back camera found, use the first available camera
        const deviceToUse = isBackCamera ? (backCamera || devices[0]) : (devices[1] || devices[0]);
        console.log('Selected camera:', deviceToUse);
        setSelectedDeviceId(deviceToUse.id);
        setIsBackCamera(!!backCamera && deviceToUse.id === backCamera.id);
      } else {
        console.warn('No cameras found');
        setCameraError('No cameras found');
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setCameraError('Failed to access camera');
    }
  }, [isBackCamera]);

  useEffect(() => {
    if (isScannerOpen && !selectedDeviceId) {
      getCameraDevices();
    }
  }, [isScannerOpen, selectedDeviceId, getCameraDevices]);

  const handleCameraInit = useCallback(() => {
    console.log('Camera initialized successfully');
    // Remove the delay and set state immediately
    setIsCameraInitialized(true);
    setCameraError(null);
  }, []);

  const handleStopScanning = useCallback(async () => {
    console.log('Stopping scanner...');
    
    // First set states to trigger cleanup
    setIsScannerOpen(false);
    setSelectedDeviceId(null);
    setIsCameraInitialized(false);
    setCameraError(null);

    // Wait for cleanup to start
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Then clean up any remaining elements
    const videoElements = document.querySelectorAll('video');
    for (const video of videoElements) {
      try {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => {
            try {
              track.stop();
            } catch (e) {
              console.log('Track stop error:', e);
            }
          });
          video.srcObject = null;
        }
      } catch (error) {
        console.error('Error cleaning up video element:', error);
      }
    }

    // Remove video elements first
    videoElements.forEach(video => {
      try {
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
      } catch (e) {
        console.log('Video removal error:', e);
      }
    });

    // Remove any remaining scanner elements
    document.querySelectorAll('[id^="qr-reader"]').forEach(element => {
      try {
        if (element.parentNode) {
          element.innerHTML = '';
          element.parentNode.removeChild(element);
        }
      } catch (e) {
        console.log('Element removal error:', e);
      }
    });

    // Wait for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 50));
  }, []);

  const toggleCamera = useCallback(async () => {
    if (isTogglingCamera.current) return;
    
    try {
      isTogglingCamera.current = true;
      console.log('Toggling camera...');
      
      // First stop the current scanner
      await handleStopScanning();
      
      // Add a small delay before switching
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Then update camera states
      if (availableCameras.length > 1) {
        const currentIndex = availableCameras.findIndex(camera => camera.id === selectedDeviceId);
        const nextIndex = (currentIndex + 1) % availableCameras.length;
        const nextCamera = availableCameras[nextIndex];
        
        console.log('Switching to camera:', nextCamera);
        setIsBackCamera(
          nextCamera.label.toLowerCase().includes('back') || 
          nextCamera.label.toLowerCase().includes('rear')
        );
        
        // Wait before setting new device ID
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsScannerOpen(true);
        setSelectedDeviceId(nextCamera.id);
      } else {
        // If only one camera, just toggle the facing mode
        setIsBackCamera(prev => !prev);
        setSelectedDeviceId(null); // This will trigger getCameraDevices
        
        // Wait before reopening scanner
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsScannerOpen(true);
      }
    } finally {
      // Add a small delay before clearing the toggling flag
      await new Promise(resolve => setTimeout(resolve, 100));
      isTogglingCamera.current = false;
    }
  }, [availableCameras, selectedDeviceId, handleStopScanning]);

  const handleScan = useCallback(async (data: string | null) => {
    if (!data || scanStatus !== 'idle') {
      return;
    }

    try {
      setScanStatus('processing');
      console.log('Processing QR code data:', data);
      let ticketId: string;
      let qrData: any = null;

      // Try to parse as JSON first
      try {
        qrData = JSON.parse(data);
        console.log('Successfully parsed QR data as JSON:', qrData);
        
        // Check for different possible ticket ID fields (including 't' optimized key)
        ticketId = qrData.t || qrData.ticketId || qrData.id || qrData.ticket;
        
        if (!ticketId) {
          throw new Error('Invalid QR code format - missing ticket identifier');
        }
        console.log('Extracted ticketId from JSON:', ticketId);
      } catch (e) {
        // If not JSON, try using the data directly as ticketId
        console.log('Failed to parse as JSON, using raw data as ticketId');
        ticketId = data.trim();
      }

      // Validate ticket ID format
      if (!ticketId || ticketId.length < 1) {
        throw new Error('Invalid ticket identifier format');
      }

      console.log('Attempting to fetch ticket with ID:', ticketId);
      const ticket = await ticketService.getTicket(ticketId);
      
      if (!ticket) {
        throw new Error('Ticket not found in database');
      }

      // Verification code validation (if available in QR)
      if (qrData && qrData.v && ticket.verificationCode !== qrData.v) {
        throw new Error('Security verification code mismatch');
      }

      // Comprehensive ticket validation
      if (!ticket.eventDetails || !ticket.eventDetails.title) {
        throw new Error('Invalid ticket data - missing event details');
      }

      if (ticket.status === 'used' || ticket.validationsRemaining <= 0) {
        throw new Error(`Ticket already used (${ticket.usedCount}/${ticket.quantity} times)`);
      }

      if (ticket.status === 'cancelled') {
        throw new Error('This ticket has been cancelled');
      }

      // Auto-validate ticket (1 validation)
      console.log('Auto-validating ticket...', ticket.id);
      const validationResult = await ticketService.validateTicket(ticket.id, 1);
      
      if (!validationResult.success) {
        throw new Error(validationResult.message || 'Validation transaction failed');
      }

      // Set success state
      setScannedTicketInfo({
        title: ticket.eventDetails.title,
        ticketNumber: ticket.ticketNumber,
        remaining: validationResult.validationsRemaining
      });
      setScanStatus('success');
      setScanMessage('Validated successfully!');

      // Show success message with event details
      toast.success(`Validated: "${ticket.eventDetails.title}"!`, {
        duration: 3000,
        icon: '✅'
      });

      // Notify parent component with the updated ticket
      const updatedTicket = {
        ...ticket,
        validationsRemaining: validationResult.validationsRemaining,
        usedCount: validationResult.usedCount,
        status: validationResult.status
      };
      onTicketFound(updatedTicket);

      // Cooldown for 3 seconds before resuming scans
      setTimeout(() => {
        setScanStatus('idle');
        setScannedTicketInfo(null);
      }, 3000);

    } catch (error: any) {
      console.error('QR Code Processing Error:', error);
      setScanStatus('error');
      
      const errMsg = error instanceof Error ? error.message : 'Invalid QR code';
      setScanMessage(errMsg);
      toast.error(errMsg, { duration: 3000 });

      // Cooldown for 3 seconds before resuming scans
      setTimeout(() => {
        setScanStatus('idle');
      }, 3000);
    }
  }, [onTicketFound, scanStatus]);

  const handleError = useCallback((error: string) => {
    if (!error.includes('No QR code found')) {
      console.error('Scanner error:', error);
      let errorMessage = 'Camera error. Please check permissions and try again.';
      
      if (error.toLowerCase().includes('permission')) {
        errorMessage = 'Camera access denied. Please grant camera permissions.';
      } else if (error.toLowerCase().includes('not found') || error.toLowerCase().includes('not available')) {
        errorMessage = 'No camera found. Please ensure your device has a camera.';
      } else if (error.toLowerCase().includes('constraint')) {
        errorMessage = 'Camera constraints not satisfied. Try switching cameras.';
      }

      setCameraError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (isScannerOpen) {
        handleStopScanning();
      }
    };
  }, [isScannerOpen, handleStopScanning]);

  return (
    <QRScannerWrapper>
      <QRScannerButton
        onClick={async () => {
          if (isScannerOpen) {
            await handleStopScanning();
          } else {
            setIsScannerOpen(true);
            setIsCameraInitialized(false);
            // Add a small delay before getting camera devices
            setTimeout(() => {
              getCameraDevices();
            }, 50);
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        $isScanning={isScannerOpen}
        disabled={isTogglingCamera.current}
      >
        <FiCamera size={20} />
        {isScannerOpen ? 'Stop Scanning' : 'Scan Ticket QR Code'}
      </QRScannerButton>

      <AnimatePresence>
        {isScannerOpen && selectedDeviceId && (
          <ScannerSection
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScannerContainer>
              <div>
                <QRScanner
                  onScan={handleScan}
                  onError={handleError}
                  onLoad={handleCameraInit}
                  facingMode={isBackCamera ? 'environment' : 'user'}
                  key={`${selectedDeviceId}-${isBackCamera}`}
                  isOpen={isScannerOpen}
                  constraints={{
                    deviceId: { exact: selectedDeviceId },
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 }
                  }}
                />
              </div>

              <AnimatePresence>
                {(cameraError || !isCameraInitialized) && (
                  <ScannerMessage
                    as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {cameraError ? (
                      cameraError
                    ) : (
                      <>
                        <FiLoader size={16} />
                        Initializing camera...
                      </>
                    )}
                  </ScannerMessage>
                )}
              </AnimatePresence>

              {availableCameras.length > 1 && (
                <CameraFlipButton
                  onClick={toggleCamera}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Switch Camera"
                  disabled={isTogglingCamera.current}
                >
                  <FiRefreshCw size={20} />
                </CameraFlipButton>
              )}

              {/* Validation Success/Failure/Processing overlay */}
              <AnimatePresence>
                {(scanStatus === 'success' || scanStatus === 'error' || scanStatus === 'processing') && (
                  <Overlay
                    $type={scanStatus}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {scanStatus === 'processing' && (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          style={{ marginBottom: 20 }}
                        >
                          <FiLoader size={48} />
                        </motion.div>
                        <h3>Validating Ticket...</h3>
                      </>
                    )}
                    {scanStatus === 'success' && (
                      <>
                        <AnimCircle
                          initial={{ scale: 0.5, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <svg viewBox="0 0 50 50" width="50" height="50">
                            <motion.path
                              d="M14,27 L22,35 L36,17"
                              fill="none"
                              stroke="white"
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                            />
                          </svg>
                        </AnimCircle>
                        <h2>Valid Ticket</h2>
                        {scannedTicketInfo && (
                          <div style={{ marginTop: 15, fontSize: '0.95rem', opacity: 0.95 }}>
                            <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 5 }}>{scannedTicketInfo.title}</p>
                            <p>Ticket: {scannedTicketInfo.ticketNumber}</p>
                            <p style={{ marginTop: 8, fontWeight: 500 }}>Remaining: {scannedTicketInfo.remaining}</p>
                          </div>
                        )}
                      </>
                    )}
                    {scanStatus === 'error' && (
                      <>
                        <AnimCircle
                          initial={{ scale: 0.5, rotate: 45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <svg viewBox="0 0 50 50" width="50" height="50">
                            <motion.path
                              d="M15,15 L35,35"
                              fill="none"
                              stroke="white"
                              strokeWidth="5"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <motion.path
                              d="M35,15 L15,35"
                              fill="none"
                              stroke="white"
                              strokeWidth="5"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, delay: 0.15 }}
                            />
                          </svg>
                        </AnimCircle>
                        <h2>Invalid Ticket</h2>
                        <p style={{ marginTop: 15, fontSize: '0.95rem', opacity: 0.95 }}>{scanMessage}</p>
                      </>
                    )}
                  </Overlay>
                )}
              </AnimatePresence>
            </ScannerContainer>
          </ScannerSection>
        )}
      </AnimatePresence>
    </QRScannerWrapper>
  );
};

export default QRScannerSection; 