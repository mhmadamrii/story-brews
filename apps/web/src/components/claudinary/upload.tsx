import { Button } from '@story-brew/ui/components/ui/button'
import { Cloudinary } from '@cloudinary/url-gen'
import { Input } from '@story-brew/ui/components/ui/input'
import { useState } from 'react'

export function Upload() {
  const [file, setFile] = useState(null)

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'demo',
    },
  })

  let soem = 'BCo__Thk35zEtZA_yKx998M5brA'

  console.log('file', file)

  const handleUpload = () => {
    const form = new FormData()
  }

  return (
    <div>
      <Input onChange={(e) => setFile(e.target.files[0])} type="file" />
    </div>
  )
}
