import React, { useState } from 'react'
import { Stack, Card, Spinner, Flex, Text } from '@sanity/ui'
import { useClient } from 'sanity'

function VideoDurationInput(props) {
  const { onChange, value } = props
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) {
      setErrorMessage('Please select a video file.')
      return // Exit if no file is selected
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      // Upload the file to Sanity
      const fileAsset = await client.assets.upload('file', file, {
        filename: file.name,
        contentType: file.type
      })

      if (!fileAsset) {
        setErrorMessage('Failed to upload file to Sanity.')
        return;
      }

      // Get the video duration
      const video = document.createElement('video')
      video.preload = 'metadata'

      const getDuration = new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src)
          resolve(video.duration)
        }
        video.onerror = (error) => {
          URL.revokeObjectURL(video.src)
          URL.revokeObjectURL(video.src)
          reject(error)
        }
      })

      video.src = URL.createObjectURL(file)
      const duration = await getDuration

      // Update the document with both the file reference and duration
      onChange({
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: fileAsset._id
        },
        duration: Math.round(duration)
      })
    } catch (error) {
      console.error('Upload failed:', error)
      setErrorMessage(`Upload failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack padding={3}>
      <Card>
        <label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ width: '100%', display: 'none' }} // Hide the default input
          />
          <Flex
            align="center"
            justify="center"
            padding={4}
            radius={2}
            style={{
              border: '1px dashed #ccc',
              cursor: 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <Spinner mr={2} /> Uploading and processing...
              </>
            ) : (
              <Text>Select Video File</Text>
            )}
          </Flex>
        </label>
        {errorMessage && <Text color="red">{errorMessage}</Text>}
        {value && value.asset && (
          <div>
            Current file: {value.asset._ref}
            {value.duration && <div>Duration: {value.duration} seconds</div>}
          </div>
        )}
      </Card>
    </Stack>
  )
}

export default VideoDurationInput