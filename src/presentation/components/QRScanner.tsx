import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCamera, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ScannerContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 12px;
  }
`;

const SwitchCameraButton = styled(motion.button)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
  }
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ScannerMessage = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  max-width: 80%;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 15px;
  }
`;

const ScannerElement = styled.div`
  width: 100%;
  min-height: 300px;
  border-radius: 16px;
  overflow: hidden;
  background: transparent;
  position: relative;

  @media (max-width: 768px) {
    min-height: 250px;
  }
`;

interface QRScannerProps {
  onScan: (data: string | null) => void;
  onError?: (error: string) => void;
}

interface Camera {
  id: string;
  label: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const scannerDivId = 'qr-scanner';

  // Cleanup function
  const cleanup = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  // First effect: Set mounted state and cleanup
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      cleanup();
    };
  }, []);

  // Second effect: Get available cameras
  useEffect(() => {
    if (!isMounted) return;

    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
          .map(device => ({
            id: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 4)}`
          }));
        
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setCurrentCameraIndex(0);
        } else {
          setCameraError('No cameras found on your device');
        }
        setIsInitializing(false);
      } catch (err) {
        console.error('Error accessing cameras:', err);
        setCameraError('Failed to access camera devices. Please check permissions.');
        setIsInitializing(false);
      }
    };

    getCameras();
  }, [isMounted]);

  // Third effect: Initialize scanner when cameras are ready
  useEffect(() => {
    if (!isMounted || !elementRef.current) return;

    const initializeScanner = async () => {
      try {
        await cleanup(); // Stop any existing scanner

        // Check if we have cameras and valid index
        if (!cameras.length || currentCameraIndex >= cameras.length) {
          throw new Error('No valid camera found');
        }

        // Get the selected camera
        const camera = cameras[currentCameraIndex];
        if (!camera?.id) {
          throw new Error('Invalid camera ID');
        }

        // Create new scanner instance
        const html5QrCode = new Html5Qrcode(scannerDivId);
        scannerRef.current = html5QrCode;

        console.log('Starting camera:', camera.label, camera.id);

        // Start scanning
        await html5QrCode.start(
          camera.id,
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250
            },
            aspectRatio: window.innerWidth < 768 ? 1.0 : 1.33,
            videoConstraints: {
              deviceId: camera.id,
              facingMode: "environment",
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 }
            }
          },
          (decodedText) => {
            if (isMounted) {
              onScan(decodedText);
            }
          },
          (errorMessage) => {
            // Only report non-QR code errors
            if (typeof onError === 'function' && !errorMessage.includes('No QR code found')) {
              onError(errorMessage);
            }
          }
        );

        setCameraError(null);
        setIsInitializing(false);

      } catch (error) {
        console.error('Scanner initialization error:', error);
        setCameraError(
          'Unable to start camera. Please ensure you have granted camera permissions and try again.'
        );
        setIsInitializing(false);
      }
    };

    const timer = setTimeout(initializeScanner, 500);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [cameras, currentCameraIndex, onScan, onError, isMounted]);

  // Fourth effect: Apply styles
  useEffect(() => {
    if (!isMounted) return;

    const style = document.createElement('style');
    style.textContent = `
      #${scannerDivId} {
        width: 100%;
        height: 100%;
      }
      #${scannerDivId} video {
        width: 100% !important;
        height: auto !important;
        min-height: 300px !important;
        max-height: 80vh !important;
        border-radius: 12px;
        object-fit: cover;
        background: #000;
      }
      @media (max-width: 768px) {
        #${scannerDivId} video {
          min-height: 250px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isMounted]);

  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const nextCameraIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextCameraIndex);
  };

  if (isInitializing) {
    return (
      <ScannerContainer>
        <ScannerOverlay>
          <ScannerMessage>
            <FiLoader size={24} style={{ marginBottom: '10px', animation: 'spin 1s linear infinite' }} />
            Initializing camera...
          </ScannerMessage>
        </ScannerOverlay>
      </ScannerContainer>
    );
  }

  if (cameraError) {
    return (
      <ScannerContainer>
        <ScannerOverlay>
          <ScannerMessage>
            {cameraError}
          </ScannerMessage>
        </ScannerOverlay>
      </ScannerContainer>
    );
  }

  return (
    <ScannerContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <ScannerElement ref={elementRef} id={scannerDivId} />
      {cameras.length > 1 && (
        <SwitchCameraButton
          onClick={handleSwitchCamera}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiCamera size={20} />
        </SwitchCameraButton>
      )}
    </ScannerContainer>
  );
};

export default QRScanner;
