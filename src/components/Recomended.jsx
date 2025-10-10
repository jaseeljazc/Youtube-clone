import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_KEY } from '../data'
import { formatViewCount, formatPublishedDate } from '../utils/formatters'

const Recomended = ({categoryId}) => {
  const [apiData, setApiData] = useState([])

  const fetchRecommendedVideos = async () => {
    try {
      let url;
      
      if (categoryId === "0" || !categoryId) {
        // For Home category or no category, get most popular videos
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&maxResults=50&key=${API_KEY}`;
      } else {
        // For specific categories
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&videoCategoryId=${categoryId}&maxResults=50&key=${API_KEY}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items) {
        setApiData(data.items);
      }
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
    }
  };

  useEffect(() => {
    fetchRecommendedVideos();
  }, [categoryId]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended</h2>
      
      {apiData.length > 0 ? (
        apiData.map((video, index) => (
          <Link 
            key={video.id || index} 
            to={`/video/${video.snippet.categoryId}/${video.id}`}
            className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors duration-200"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <img 
                src={video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url} 
                alt={video.snippet.title}
                className="w-40 h-24 object-cover rounded-lg"
              />
            </div>
            
            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                {video.snippet.title}
              </h4>
              <p className="text-xs text-gray-600 mb-1">{video.snippet.channelTitle}</p>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-gray-500">
                  {formatViewCount(parseInt(video.statistics?.viewCount || 0))} views
                </p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500">
                  {formatPublishedDate(video.snippet.publishedAt)}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading recommended videos...</p>
        </div>
      )}
    </div>
  )
}

export default Recomended