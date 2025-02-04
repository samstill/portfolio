import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
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
    position: relative !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;

    & > img, & > button {
      display: none !important;
    }
  }

  video {
    position: absolute !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    transform: none !important;
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

  const cleanup = async () => {
    if (cleanupInProgress.current) {
      console.log('Cleanup already in progress, skipping...');
      return;
    }

    try {
      cleanupInProgress.current = true;
      console.log('Cleaning up scanner...');
      
      // Clear initialization check interval
      if (initCheckRef.current) {
        clearInterval(initCheckRef.current);
        initCheckRef.current = null;
      }

      // First stop all video tracks
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
        } catch (e) {
          console.log('Video cleanup error:', e);
        }
      }
      
      // Then stop the scanner
      if (scannerRef.current) {
        try {
          console.log('Stopping scanner...');
          // First try to stop scanning
          await scannerRef.current.stop().catch(e => {
            console.log('Stop error (expected):', e);
          });
          
          // Then try to clear
          await scannerRef.current.clear().catch(e => {
            console.log('Clear error (expected):', e);
          });
        } catch (e) {
          console.log('Scanner cleanup error:', e);
        } finally {
          scannerRef.current = null;
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

      // Then remove scanner elements
      try {
        const container = document.getElementById(scannerDivId);
        if (container && container.parentNode) {
          container.innerHTML = '';
          container.parentNode.removeChild(container);
        }
      } catch (e) {
        console.log('Container removal error:', e);
      }

      // Finally remove any remaining scanner elements
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
      
      setIsInitializing(false);
    } catch (error) {
      console.error('Cleanup error:', error);
    } finally {
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
    videoElement.style.transform = 'none';
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
        const qrboxSize = Math.min(containerWidth * 0.8, 250);

        const config = {
          fps: 15,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1.0,
          disableFlip: false,
          showTorchButtonIfSupported: false,
          showZoomSliderIfSupported: false,
          verbose: true,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.AZTEC
          ],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        };

        // Simplified camera config
        const cameraConfig = constraints?.deviceId 
          ? { deviceId: constraints.deviceId }
          : { facingMode };

        console.log('Starting scanner with config:', { config, cameraConfig });

        await html5QrCode.start(
          { ...cameraConfig },  // Spread to ensure we pass a new object
          config,
          (decodedText) => {
            console.log('QR Code detected:', decodedText);
            if (isMounted.current) {
              // Immediately stop scanning when a valid code is detected
              html5QrCode.stop().then(() => {
                console.log('Scanner stopped after successful detection');
                if (isMounted.current) {
                  // Only process if we haven't recently scanned this code
                  if (lastScannedCode.current === decodedText && 
                      Date.now() - lastScanTime.current < 2000) {
                    console.log('Duplicate scan detected, ignoring');
                    return;
                  }
                  lastScannedCode.current = decodedText;
                  lastScanTime.current = Date.now();
                  
                  // Notify parent component of successful scan
                  console.log('Notifying parent of successful scan');
                  onScan(decodedText);
                }
              }).catch(err => {
                console.error('Error stopping scanner after detection:', err);
              });
            }
          },
          (errorMessage) => {
            // Only log non-standard errors
            if (!errorMessage.includes('No MultiFormat Readers were able to detect the code') &&
                !errorMessage.includes('No QR code found')) {
              console.log('Scanning status:', errorMessage);
              if (isMounted.current && onError) {
                console.error('Scanner error:', errorMessage);
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
              Initializing camera...
            </ScannerMessage>
          </ScannerOverlay>
        )}
      </ScannerElement>
    </ScannerContainer>
  );
};

export default QRScanner;
