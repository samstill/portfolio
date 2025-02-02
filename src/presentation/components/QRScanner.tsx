import { useEffect, useState } from 'react';
import styled from "styled-components";
import { Html5Qrcode } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { IoFlashlight, IoCameraReverse } from 'react-icons/io5';

const SCANNER_SIZE = 250;
const BORDER_SIZE = SCANNER_SIZE - 40;

const ScannerContainer = styled(motion.div)`
  width: ${SCANNER_SIZE}px;
  height: ${SCANNER_SIZE}px;
  background: ${props => props.theme.background};
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin: 20px auto;

  #reader {
    width: ${SCANNER_SIZE}px !important;
    height: ${SCANNER_SIZE}px !important;
    position: relative;
    overflow: hidden;
    background: transparent !important;
  }

  video {
    width: ${SCANNER_SIZE}px !important;
    height: ${SCANNER_SIZE}px !important;
    object-fit: cover !important;
    border-radius: 20px !important;
  }
`;

const ScannerBorder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${BORDER_SIZE}px;
  height: ${BORDER_SIZE}px;
  border: 2px solid #4a6cf7;
  border-radius: 15px;
  z-index: 10;
  pointer-events: none;
  animation: scan 2s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 15px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  }

  @keyframes scan {
    0% {
      border-color: #4a6cf7;
    }
    50% {
      border-color: #6e8efb;
      transform: translate(-50%, -50%) scale(1.02);
    }
    100% {
      border-color: #4a6cf7;
    }
  }
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  display: flex;
  gap: 8px;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 20;
`;

const ControlButton = styled(motion.button)<{ $isActive?: boolean }>`
  background: ${props => props.$isActive ? 'rgba(74, 108, 247, 0.5)' : 'rgba(255, 255, 255, 0.15)'};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.$isActive ? 'rgba(74, 108, 247, 0.7)' : 'rgba(255, 255, 255, 0.25)'};
  }
`;

interface QRScannerProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult, onError, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<string>('');
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        setCameras(devices);
        
        if (devices.length > 0) {
          const backCamera = devices.find(device => device.label.toLowerCase().includes('back')) || devices[0];
          setCurrentCamera(backCamera.id);
          
          const html5QrCode = new Html5Qrcode("reader");
          setScanner(html5QrCode);

          await html5QrCode.start(
            backCamera.id,
            {
              fps: 10,
              qrbox: { width: BORDER_SIZE, height: BORDER_SIZE },
              aspectRatio: 1,
            },
            (decodedText) => {
              onResult(decodedText);
              html5QrCode.stop().then(() => {
                onClose();
              }).catch(console.error);
            },
            (errorMessage) => {
              if (onError) onError(errorMessage);
            }
          );
          
          setIsScanning(true);
        }
      } catch (err) {
        console.error('Error initializing scanner:', err);
        if (onError) onError(String(err));
      }
    };

    initializeScanner();

    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, [onResult, onError, onClose]);

  const toggleFlash = async () => {
    if (!scanner) return;
    
    try {
      if (isFlashOn) {
        await scanner.turnOffFlash();
      } else {
        await scanner.turnOnFlash();
      }
      setIsFlashOn(!isFlashOn);
    } catch (err) {
      console.error('Error toggling flash:', err);
    }
  };

  const switchCamera = async () => {
    if (!scanner || cameras.length < 2) return;
    
    try {
      await scanner.stop();
      
      const currentIndex = cameras.findIndex(cam => cam.id === currentCamera);
      const nextIndex = (currentIndex + 1) % cameras.length;
      const nextCamera = cameras[nextIndex];
      
      await scanner.start(
        nextCamera.id,
        {
          fps: 10,
          qrbox: { width: BORDER_SIZE, height: BORDER_SIZE },
          aspectRatio: 1,
        },
        (decodedText) => {
          onResult(decodedText);
          scanner.stop().then(() => {
            onClose();
          }).catch(console.error);
        },
        (errorMessage) => {
          if (onError) onError(errorMessage);
        }
      );
      
      setCurrentCamera(nextCamera.id);
      setIsFlashOn(false);
    } catch (err) {
      console.error('Error switching camera:', err);
    }
  };

  return (
    <ScannerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div id="reader" />
      <ScannerBorder />

      <Controls>
        <ControlButton
          $isActive={isFlashOn}
          onClick={toggleFlash}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoFlashlight size={18} />
        </ControlButton>
        {cameras.length > 1 && (
          <ControlButton
            onClick={switchCamera}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoCameraReverse size={18} />
          </ControlButton>
        )}
      </Controls>
    </ScannerContainer>
  );
};

export default QRScanner;
