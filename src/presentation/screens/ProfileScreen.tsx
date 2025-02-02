import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../shared/context/AuthContext';
import { FiUser, FiMail, FiEdit2, FiCamera, FiLoader, FiTrash2, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, updatePassword, EmailAuthProvider, getAuth, multiFactor, sendEmailVerification, applyActionCode, checkActionCode } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
import { useProfile } from '../../shared/context/ProfileContext';
import { reauthenticateWithCredential } from 'firebase/auth';

// Add this utility function near the top of the file, after imports
const cleanFirebaseError = (error: any): string => {
  const errorMessage = error?.message || 'An error occurred';
  return errorMessage.replace(/^firebase:\s*/i, '').replace(/\([^)]*\)/g, '').trim();
};

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: ${props => props.theme.background};
`;

const ProfileCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  position: relative;
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.$imageUrl 
    ? `url(${props.$imageUrl}) no-repeat center/cover`
    : 'linear-gradient(135deg, #6e8efb, #4a6cf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
`;

const CameraButton = styled.button<{ disabled?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.theme.text};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  color: ${props => props.theme.background};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SpinningLoader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin-bottom: 10px;
`;

const Email = styled.p`
  color: ${props => props.theme.text}CC;
  font-size: 1.1rem;
`;

const Section = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InfoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    color: ${props => props.theme.text}99;
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  p {
    color: ${props => props.theme.text};
    font-size: 1.1rem;
  }
`;

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  @media (max-width: 600px) {
    margin-top: 30px;
  }
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const PopupContent = styled(motion.div)`
  background: rgba(20, 20, 25, 0.95);
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);

  & > * {
    width: 100%;
    max-width: 340px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PopupTitle = styled.h2`
  color: #fff;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const PopupText = styled.p<{ $success?: boolean }>`
  color: ${props => props.$success ? '#28a745' : 'rgba(255, 255, 255, 0.8)'};
  margin-bottom: 20px;
  line-height: 1.5;
`;

const PopupInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 15px auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  display: block;

  &:focus {
    outline: none;
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const PopupButtons = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px auto 0;
  width: 100%;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ButtonSpinner = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupButton = styled.button<{ variant?: 'danger' | 'cancel', $isLoading?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  background: ${props => props.variant === 'danger' ? '#dc3545' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.variant === 'danger' ? 'white' : props.theme.text};
  opacity: ${props => props.$isLoading ? 0.7 : 1};
  flex: 1;

  &:hover {
    opacity: ${props => props.$isLoading ? 0.7 : 0.9};
  }
`;

const SecuritySection = styled(Section)`
  margin-top: 40px;
`;

const SecurityCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
`;

const SecurityInfo = styled.div`
  flex: 1;

  h3 {
    color: ${props => props.theme.text};
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  p {
    color: ${props => props.theme.text}99;
    font-size: 0.9rem;
  }
`;

const SecurityButton = styled(motion.button)<{ $isLoading?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  background: ${props => props.theme.text};
  color: ${props => props.theme.background};
  opacity: ${props => props.$isLoading ? 0.7 : 1};
  
  @media (max-width: 600px) {
    width: 100%;
  }
`;

// Now define DeleteButton after SecurityButton
const DeleteButton = styled(SecurityButton)`
  background: #dc3545;
  color: white;

  &:hover {
    background: #c82333;
  }
`;

const DangerZone = styled(Section)`
  margin-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 40px;
`;

const DangerCard = styled(SecurityCard)`
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);

  ${SecurityInfo} {
    h3 {
      color: #dc3545;
    }
    p {
      color: rgba(220, 53, 69, 0.8);
    }
  }
`;

const ProfileScreen: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { profileImage, setProfileImage } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [deleteError, setDeleteError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showMfaPopup, setShowMfaPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSettingUpMfa, setIsSettingUpMfa] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateFileName = () => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    return `profile_${timestamp}_${random}.jpg`;
  };

  const validateImage = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, GIF, WEBP)');
      return false;
    }
    return true;
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'image/jpeg'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const deleteOldProfilePhoto = async (photoUrl: string) => {
    try {
      // Extract the path from the URL
      const photoPath = decodeURIComponent(photoUrl.split('/o/')[1].split('?')[0]);
      const oldPhotoRef = ref(storage, photoPath);
      await deleteObject(oldPhotoRef);
    } catch (error) {
      console.error("Error deleting old profile photo:", error);
      // Continue with the upload even if delete fails
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!validateImage(file)) return;
      
      setIsUploading(true);
      const compressedImage = await compressImage(file);
      const fileName = generateFileName();
      const storageRef = ref(storage, `profileImages/${currentUser?.uid}/${fileName}`);
      
      // Delete old profile photo if exists
      if (profileImage) {
        await deleteOldProfilePhoto(profileImage);
      }

      const uploadTask = await uploadBytes(storageRef, compressedImage);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      // Update Firestore with new profile photo URL
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          profilePhoto: downloadURL
        });
      }
      
      setProfileImage(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail !== currentUser?.email) {
      setDeleteError('Email does not match');
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError('');

      // First, delete profile photo if exists
      if (profileImage) {
        await deleteOldProfilePhoto(profileImage);
      }

      // Delete user document from Firestore
      if (currentUser?.uid) {
        await deleteDoc(doc(db, 'users', currentUser.uid));
      }

      // Delete user authentication
      await deleteUser(currentUser!);
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        setDeleteError('Please log out and log in again to delete your account');
      } else {
        setDeleteError(cleanFirebaseError(error));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError('');
      setSuccessMessage('');
      setIsChangingPassword(true);
      if (!currentUser) return;

      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      setSuccessMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      
      // Auto close after showing success message
      setTimeout(() => {
        setShowPasswordPopup(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error: any) {
      console.error('Error changing password:', error);
      setPasswordError(cleanFirebaseError(error));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const setupEmailMFA = async () => {
    try {
      setMfaError('');
      setIsSettingUpMfa(true);
      if (!currentUser) return;

      await sendEmailVerification(currentUser, {
        url: `${window.location.origin}/verify-email?redirect=profile`,
        handleCodeInApp: true,
      });

      setEmailVerificationSent(true);
      setSuccessMessage('Verification email sent! Please check your inbox.');

      // Auto close after showing success message
      setTimeout(() => {
        setShowMfaPopup(false);
        setSuccessMessage('');
        setEmailVerificationSent(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error setting up email verification:', error);
      setMfaError(cleanFirebaseError(error));
    } finally {
      setIsSettingUpMfa(false);
    }
  };

  return (
    <Container>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeader>
          <AvatarContainer>
            <Avatar $imageUrl={profileImage}>
              {!profileImage && currentUser?.email && getInitials(currentUser.email)}
            </Avatar>
            {isUploading && (
              <LoadingOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SpinningLoader
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <FiLoader size={24} />
                </SpinningLoader>
              </LoadingOverlay>
            )}
            <CameraButton onClick={handleCameraClick} disabled={isUploading}>
              <FiCamera size={16} />
            </CameraButton>
          </AvatarContainer>
          
          <ProfileInfo>
            <Name>{currentUser?.email?.split('@')[0]}</Name>
            <Email>{currentUser?.email}</Email>
          </ProfileInfo>
        </ProfileHeader>

        <Section>
          <SectionTitle>
            <FiUser size={20} />
            Personal Information
          </SectionTitle>
          <Grid>
            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Username</h3>
              <p>{currentUser?.email?.split('@')[0]}</p>
            </InfoCard>
            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Email</h3>
              <p>{currentUser?.email}</p>
            </InfoCard>
            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Account Created</h3>
              <p>{currentUser?.metadata.creationTime?.split('GMT')[0]}</p>
            </InfoCard>
            <InfoCard
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Last Sign In</h3>
              <p>{currentUser?.metadata.lastSignInTime?.split('GMT')[0]}</p>
            </InfoCard>
          </Grid>
        </Section>

        <SecuritySection>
          <SectionTitle>
            <FiLock size={20} />
            Security Settings
          </SectionTitle>
          <Grid>
            <SecurityCard>
              <SecurityInfo>
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </SecurityInfo>
              <SecurityButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPasswordPopup(true)}
                $isLoading={isChangingPassword}
              >
                <ButtonContent>
                  {isChangingPassword && (
                    <ButtonSpinner
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <FiLoader size={16} />
                    </ButtonSpinner>
                  )}
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </ButtonContent>
              </SecurityButton>
            </SecurityCard>
            
            <SecurityCard>
              <SecurityInfo>
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
              </SecurityInfo>
              <SecurityButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMfaPopup(true)}
                $isLoading={isSettingUpMfa}
              >
                <ButtonContent>
                  {isSettingUpMfa && (
                    <ButtonSpinner
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <FiLoader size={16} />
                    </ButtonSpinner>
                  )}
                  {isSettingUpMfa ? 'Verifying...' : 'Verify Code'}
                </ButtonContent>
              </SecurityButton>
            </SecurityCard>
          </Grid>
        </SecuritySection>

        {!isAdmin && (
          <DangerZone>
            <SectionTitle style={{ color: '#dc3545' }}>
              <FiTrash2 size={20} />
              Danger Zone
            </SectionTitle>
            <DangerCard>
              <SecurityInfo>
                <h3>Delete Account</h3>
                <p>Permanently remove your account and all associated data</p>
              </SecurityInfo>
              <DeleteButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeletePopup(true)}
                $isLoading={isDeleting}
              >
                <ButtonContent>
                  {isDeleting && (
                    <ButtonSpinner
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <FiLoader size={16} />
                    </ButtonSpinner>
                  )}
                  <FiTrash2 size={16} />
                  Delete Account
                </ButtonContent>
              </DeleteButton>
            </DangerCard>
          </DangerZone>
        )}
      </ProfileCard>

      <AnimatePresence>
        {showDeletePopup && (
          <PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeletePopup(false)}
          >
            <PopupContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PopupTitle>Delete Account</PopupTitle>
              <PopupText>
                This action is permanent and cannot be undone. All your data will be permanently deleted.
                Please type your email address to confirm:
              </PopupText>
              <PopupInput
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={currentUser?.email || ''}
                disabled={isDeleting}
              />
              {deleteError && (
                <PopupText style={{ color: '#dc3545', marginTop: 0 }}>
                  {deleteError}
                </PopupText>
              )}
              <PopupButtons>
                <PopupButton 
                  variant="cancel"
                  onClick={() => {
                    setShowDeletePopup(false);
                    setConfirmEmail('');
                    setDeleteError('');
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </PopupButton>
                <PopupButton 
                  variant="danger"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  $isLoading={isDeleting}
                >
                  <ButtonContent>
                    {isDeleting && (
                      <ButtonSpinner
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <FiLoader size={16} />
                      </ButtonSpinner>
                    )}
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </ButtonContent>
                </PopupButton>
              </PopupButtons>
            </PopupContent>
          </PopupOverlay>
        )}
      </AnimatePresence>

      {/* Password Change Popup */}
      <AnimatePresence>
        {showPasswordPopup && (
          <PopupOverlay>
            <PopupContent>
              <PopupTitle>Change Password</PopupTitle>
              {successMessage && (
                <PopupText $success>{successMessage}</PopupText>
              )}
              <PopupInput
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PopupInput
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {passwordError && (
                <PopupText style={{ color: '#dc3545' }}>{passwordError}</PopupText>
              )}
              <PopupButtons>
                <PopupButton 
                  variant="cancel" 
                  onClick={() => setShowPasswordPopup(false)}
                  $isLoading={isChangingPassword}
                >
                  Cancel
                </PopupButton>
                <PopupButton 
                  variant="danger" 
                  onClick={handleChangePassword}
                  $isLoading={isChangingPassword}
                >
                  <ButtonContent>
                    {isChangingPassword && (
                      <ButtonSpinner
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <FiLoader size={16} />
                      </ButtonSpinner>
                    )}
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </ButtonContent>
                </PopupButton>
              </PopupButtons>
            </PopupContent>
          </PopupOverlay>
        )}
      </AnimatePresence>

      {/* MFA Setup Popup */}
      <AnimatePresence>
        {showMfaPopup && (
          <PopupOverlay>
            <PopupContent>
              <PopupTitle>Setup Email Authentication</PopupTitle>
              {successMessage && (
                <PopupText $success>{successMessage}</PopupText>
              )}
              {!emailVerificationSent ? (
                <>
                  <PopupText>
                    We'll send a verification email to your registered email address.
                    Click the link in the email to complete the setup.
                  </PopupText>
                  <PopupButtons>
                    <PopupButton 
                      variant="cancel" 
                      onClick={() => setShowMfaPopup(false)}
                      $isLoading={isSettingUpMfa}
                    >
                      Cancel
                    </PopupButton>
                    <PopupButton 
                      variant="danger" 
                      onClick={setupEmailMFA}
                      $isLoading={isSettingUpMfa}
                    >
                      <ButtonContent>
                        {isSettingUpMfa && (
                          <ButtonSpinner
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <FiLoader size={16} />
                          </ButtonSpinner>
                        )}
                        {isSettingUpMfa ? 'Sending...' : 'Send Verification Email'}
                      </ButtonContent>
                    </PopupButton>
                  </PopupButtons>
                </>
              ) : (
                <PopupText>
                  Verification email has been sent. Please check your inbox and click the link to complete the setup.
                </PopupText>
              )}
              {mfaError && (
                <PopupText style={{ color: '#dc3545' }}>{mfaError}</PopupText>
              )}
            </PopupContent>
          </PopupOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProfileScreen;