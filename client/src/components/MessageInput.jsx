import React, { useState, useRef } from 'react';
import { FaPaperPlane, FaPaperclip, FaImage, FaVideo, FaFile } from 'react-icons/fa';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, maxFileSize, allowedFileTypes }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() === '' && attachments.length === 0) {
      return;
    }
    
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check file size
    if (file.size > maxFileSize) {
      setAttachmentError(`File too large. Maximum size is ${maxFileSize / (1024 * 1024 * 1024)} GB`);
      return;
    }
    
    setAttachments([file]);
    setAttachmentError('');
    setShowAttachmentMenu(false);
  };
  
  const handleAttachmentClick = (type) => {
    fileInputRef.current.setAttribute('accept', type);
    fileInputRef.current.click();
    setShowAttachmentMenu(false);
  };
  
  const removeAttachment = () => {
    setAttachments([]);
  };
  
  return (
    <div className="message-input-container">
      {attachmentError && (
        <div className="attachment-error">{attachmentError}</div>
      )}
      
      {attachments.length > 0 && (
        <div className="attachment-preview">
          <div className="attachment-info">
            <span className="attachment-name">{attachments[0].name}</span>
            <span className="attachment-size">
              {(attachments[0].size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          <button className="remove-attachment" onClick={removeAttachment}>
            &times;
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="message-form">
        <div className="attachment-button">
          <button 
            type="button" 
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="attachment-icon"
          >
            <FaPaperclip />
          </button>
          
          {showAttachmentMenu && (
            <div className="attachment-menu">
              <button 
                type="button"
                onClick={() => handleAttachmentClick('image/*')}
                className="attachment-option"
              >
                <FaImage /> Photo
              </button>
              <button 
                type="button"
                onClick={() => handleAttachmentClick('video/*')}
                className="attachment-option"
              >
                <FaVideo /> Video
              </button>
              <button 
                type="button"
                onClick={() => handleAttachmentClick('.pdf,.doc,.docx,.xls,.xlsx')}
                className="attachment-option"
              >
                <FaFile /> Document
              </button>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        
        <button type="submit" className="send-button">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 