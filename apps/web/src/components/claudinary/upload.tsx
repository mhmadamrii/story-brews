import { toast } from 'sonner'

export async function uploadToCloudinary(file: Blob | File) {
  const cloudName = 'drrizo231' // Fallback to demo if not set
  const uploadPreset = 'story-brew' // Fallback

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.secure_url as string
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    toast.error('Failed to upload image to Cloudinary')
    throw error
  }
}
