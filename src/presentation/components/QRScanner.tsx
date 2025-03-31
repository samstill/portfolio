import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScanType, Html5QrcodeScannerState } from 'html5-qrcode';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const ScannerContainer = styled(motion.div)`
  width: 100%;
  max-width: min(500px, 90vw);
  aspect-ratio: 1;
  margin: 0 auto;
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
`;

const ScannerElement = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  #qr-shaded-region {
    border-width: 2px !important;
    border-style: solid !important;
    border-color: white !important;
    margin: 0 !important;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.5) !important;
  }

  & > div {
    width: 100% !important;
    height: 100% !important;
    
    video {
      object-fit: cover !important;
      transform: none !important;
    }
  }
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
`;

const ScannerMessage = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 20px;
  border-radius: 8px;
`;

interface QRScannerProps {
  onScan: (data: string | null) => void;
  onError?: (error: string) => void;
  onLoad?: () => void;
  facingMode?: 'environment' | 'user';
  constraints?: MediaTrackConstraints;
  isOpen?: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  onLoad,
  facingMode = 'environment',
  constraints,
  isOpen = true
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const isMounted = useRef(true);
  const initCheckRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupInProgress = useRef(false);
  const [scannerDivId] = useState(`qr-reader-${Math.random().toString(36).substring(7)}`);
  const lastScannedCode = useRef<string | null>(null);
  const lastScanTime = useRef<number>(0);
  const [cameraError, setCameraError] = useState(false);
  const scanDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = async () => {
    if (cleanupInProgress.current) return;
    cleanupInProgress.current = true;

    try {
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        await scannerRef.current.stop().catch(console.error);
      }
      
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach(video => {
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      });

      await scannerRef.current?.clear();
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
      scannerRef.current = null;
      cleanupInProgress.current = false;
    }
  };

  // Effect to handle scanner open/close state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isOpen) {
      timeoutId = setTimeout(() => {
        cleanup();
      }, 100);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen]);

  const setupVideoElement = (videoElement: HTMLVideoElement) => {
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.objectFit = 'cover';
    videoElement.style.position = 'absolute';
    videoElement.style.left = '0';
    videoElement.style.top = '0';
    videoElement.style.transform = 'scale(1.1)';
    videoElement.style.filter = 'contrast(1.2) brightness(1.1)';
    videoElement.style.display = 'block';
    videoElement.style.opacity = '1';
    videoElement.style.visibility = 'visible';
    videoElement.setAttribute('playsinline', 'true');
  };

  const checkVideoReady = (container: HTMLElement | null) => {
    if (!container) return false;
    const videoElement = container.querySelector('video');
    if (!videoElement) return false;

    setupVideoElement(videoElement);
    
    // Simplified video readiness check
    const isVideoReady = 
      videoElement.readyState >= 2 && // HAVE_CURRENT_DATA or better
      !videoElement.paused &&
      videoElement.style.display !== 'none' &&
      videoElement.style.visibility !== 'hidden';
    
    if (isVideoReady) {
      console.log('Video is ready');
      setIsInitializing(false);
      if (onLoad) onLoad();
      
      // Ensure video is visible
      requestAnimationFrame(() => {
        if (videoElement) {
          setupVideoElement(videoElement);
        }
      });
      
      return true;
    }
    return false;
  };

  useEffect(() => {
    let isInitialized = false;
    let timeoutId: NodeJS.Timeout;

    const initializeScanner = async () => {
      if (!isOpen || isInitialized || cleanupInProgress.current) return;
      isInitialized = true;

      // Add a small delay before initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        await cleanup();

        let container = document.getElementById(scannerDivId);
        if (!container && elementRef.current) {
          container = document.createElement('div');
          container.id = scannerDivId;
          container.style.width = '100%';
          container.style.height = '100%';
          container.style.position = 'relative';
          container.style.background = 'transparent';
          elementRef.current.appendChild(container);
        }

        if (!container) {
          throw new Error('Scanner container not found');
        }

        console.log('Initializing scanner...');
        const html5QrCode = new Html5Qrcode(scannerDivId);
        scannerRef.current = html5QrCode;

        const containerWidth = container.clientWidth;
        const qrboxSize = Math.min(containerWidth * 0.8, 300);

        const config = {
          fps: 10,
          qrbox: { 
            width: Math.min(containerWidth * 0.8, 300), 
            height: Math.min(containerWidth * 0.8, 300) 
          },
          aspectRatio: 1.0,
          disableFlip: true,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: false
          }
        };

        // Simplified camera config
        const cameraConfig = constraints?.deviceId 
          ? { deviceId: constraints.deviceId }
          : { facingMode };

        console.log('Starting scanner with config:', { config, cameraConfig });

        await html5QrCode.start(
          { ...cameraConfig },
          {
            ...config,
            rememberLastUsedCamera: false,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
          },
          (decodedText) => {
            if (scanDebounceRef.current) return;
            
            console.log('QR Code detected:', decodedText);
            if (!isMounted.current) return;
            
            // Add timestamp validation
            const now = Date.now();
            if (lastScannedCode.current === decodedText && now - lastScanTime.current < 1000) {
              console.log('Duplicate scan blocked');
              return;
            }
            
            // Validate basic QR code structure
            if (typeof decodedText !== 'string' || decodedText.length < 10) {
              console.warn('Invalid QR code format');
              return;
            }

            lastScannedCode.current = decodedText;
            lastScanTime.current = now;

            scanDebounceRef.current = setTimeout(() => {
              scanDebounceRef.current = null;
            }, 500); // 500ms debounce window

            onScan(decodedText);
          },
          (errorMessage) => {
            const suppressedErrors = [
              'No MultiFormat Readers were able to detect the code',
              'No QR code found',
              'Video stream has ended'
            ];
            
            if (!suppressedErrors.some(e => errorMessage.includes(e))) {
              console.debug('Scanner error:', errorMessage);
              if (isMounted.current && onError) {
                onError(errorMessage);
              }
            }
          }
        );

        // Start checking for video readiness with a shorter timeout
        let retries = 0;
        const maxRetries = 20; // 2 seconds total
        
        initCheckRef.current = setInterval(() => {
          if (checkVideoReady(container)) {
            if (initCheckRef.current) {
              clearInterval(initCheckRef.current);
              initCheckRef.current = null;
            }
          } else if (retries >= maxRetries) {
            if (initCheckRef.current) {
              clearInterval(initCheckRef.current);
              initCheckRef.current = null;
            }
            if (isMounted.current) {
              setIsInitializing(false);
              if (onError) onError('Video failed to initialize in time');
            }
          }
          retries++;
        }, 100);

      } catch (error) {
        console.error('Scanner initialization error:', error);
        if (isMounted.current) {
          setIsInitializing(false);
          if (onError) {
            onError(error instanceof Error ? error.message : 'Failed to initialize scanner');
          }
        }
      }
    };

    timeoutId = setTimeout(() => {
      initializeScanner();
    }, 100);

    return () => {
      isMounted.current = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      cleanup();
    };
  }, [scannerDivId, facingMode, constraints, onScan, onError, onLoad, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ScannerContainer>
      <ScannerElement ref={elementRef}>
        {isInitializing && (
          <ScannerOverlay>
            <ScannerMessage>
              <FiLoader className="animate-spin" />
              {!cameraError ? 'Initializing camera...' : 'Camera Error'}
            </ScannerMessage>
          </ScannerOverlay>
        )}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            width: '80%',
            height: 2,
            background: '#4a6cf7'
          }}
          animate={{ y: ['0%', '80%', '0%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </ScannerElement>
    </ScannerContainer>
  );
};

export default QRScanner;
