import React from 'react'
import VideoPlayer from '../../components/VideoPlayer'
import Recomended from '../../components/Recomended'
import { useParams } from 'react-router-dom'


const Video = () => {


  const {videoId, categoryId} = useParams()
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-">
          {/* Main Video Content - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2">
            <VideoPlayer videoId={videoId}/>
          </div>
          
          {/* Recommended Videos Sidebar - Takes 1/3 of the width on large screens */}
          <div className="lg:col-span-1">
            <Recomended categoryId={categoryId}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Video