import React, { useState, useRef } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { validateImageFile } from '../../utils/validation'
import { vendorStorage } from '../../utils/storage'

export default function ProfilePhotoModal({ isOpen, onClose, vendor, currentUser, onPhotoUpdate }) {
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (!validateImageFile(selectedFile)) {
      setError('Please select a valid image file (JPG, PNG, WEBP) under 5MB')
      return
    }

    setError('')
    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      // Convert image to base64 for localStorage storage
      const base64Image = preview

      // Update vendor profile
      const updatedVendor = {
        ...vendor,
        profileImage: base64Image
      }

      // Save to localStorage
      vendorStorage.setProfile(vendor.id, updatedVendor)
      
      // Update vendors in main storage
      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1) {
        vendors[vendorIndex] = updatedVendor
        localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
      }

      // Update current user
      const updatedUser = {
        ...currentUser,
        profileImage: base64Image
      }
      localStorage.setItem('yengoReactCurrentUser', JSON.stringify(updatedUser))

      // Call callback to update parent state
      onPhotoUpdate(updatedVendor, updatedUser)
      
      handleClose()
    } catch (error) {
      console.error('Error uploading photo:', error)
      setError('Failed to upload photo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    setIsUploading(true)

    try {
      // Remove profile image
      const updatedVendor = {
        ...vendor,
        profileImage: null
      }

      // Save to localStorage
      vendorStorage.setProfile(vendor.id, updatedVendor)
      
      // Update vendors in main storage
      const vendors = JSON.parse(localStorage.getItem('yengoReactVendors') || '[]')
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id)
      if (vendorIndex !== -1) {
        vendors[vendorIndex] = updatedVendor
        localStorage.setItem('yengoReactVendors', JSON.stringify(vendors))
      }

      // Update current user
      const updatedUser = {
        ...currentUser,
        profileImage: null
      }
      localStorage.setItem('yengoReactCurrentUser', JSON.stringify(updatedUser))

      // Call callback to update parent state
      onPhotoUpdate(updatedVendor, updatedUser)
      
      handleClose()
    } catch (error) {
      console.error('Error removing photo:', error)
      setError('Failed to remove photo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setPreview(null)
    setFile(null)
    setError('')
    onClose()
  }

  const currentPhoto = vendor?.profileImage || currentUser?.profileImage

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Profile Photo" size="medium">
      <div style={{ textAlign: 'center' }}>
        {/* Current Photo */}
        {currentPhoto && !preview && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '0.9rem' }}>Current Photo</p>
            <img
              src={currentPhoto}
              alt="Current profile"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #3b82f6'
              }}
            />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '0.9rem' }}>Preview</p>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #10b981'
              }}
            />
          </div>
        )}

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <Button
          type="button"
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ marginBottom: '12px', width: '100%' }}
        >
          {preview ? 'Choose Different Photo' : 'Upload New Photo'}
        </Button>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {preview && (
            <Button
              type="button"
              variant="success"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save Photo'}
            </Button>
          )}
          
          {currentPhoto && !preview && (
            <Button
              type="button"
              variant="danger"
              onClick={handleRemove}
              disabled={isUploading}
            >
              {isUploading ? 'Removing...' : 'Remove Photo'}
            </Button>
          )}
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>

        {/* Supported Formats */}
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '20px' }}>
          Supported formats: JPG, JPEG, PNG, WEBP (Max 5MB)
        </p>
      </div>
    </Modal>
  )
}
