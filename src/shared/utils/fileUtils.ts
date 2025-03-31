/**
 * Utility functions for handling files in the application
 */

/**
 * Determines the type of a file based on its MIME type
 */
export const getFileType = (file: File): 'image' | 'video' | 'audio' | 'document' | 'other' => {
  const type = file.type.split('/')[0];
  
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'audio') return 'audio';
  
  // Check for document types
  const docTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  if (docTypes.includes(file.type)) return 'document';
  
  return 'other';
};

/**
 * Formats a file size in bytes to a human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}; 