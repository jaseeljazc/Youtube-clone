import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_KEY } from '../data'
import { formatViewCount, formatPublishedDate } from '../utils/formatters'

// Utility function to extract dominant color from image
const extractDominantColor = (imageSrc, callback) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  
  // Create a proxy URL to avoid CORS issues
  const proxyUrl = imageSrc.replace('i.ytimg.com', 'img.youtube.com');
  img.src = proxyUrl;
  
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Reduce canvas size for better performance
      const scaleFactor = 0.25;
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Sample pixels and collect colors
      const colorMap = {};
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 125) continue;
        
        // Skip very dark or very light colors
        const brightness = (r + g + b) / 3;
        if (brightness < 30 || brightness > 240) continue;
        
        // Calculate saturation and skip low saturation colors
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        
        // Prefer more saturated colors
        if (saturation < 0.2) continue;
        
        // Group similar colors
        const rGroup = Math.round(r / 30) * 30;
        const gGroup = Math.round(g / 30) * 30;
        const bGroup = Math.round(b / 30) * 30;
        const key = `${rGroup},${gGroup},${bGroup}`;
        
        // Weight by saturation to prefer vibrant colors
        colorMap[key] = (colorMap[key] || 0) + (1 + saturation * 2);
      }
      
      // Find most common vibrant color
      let maxCount = 0;
      let dominantColor = '59, 130, 246'; // Default blue
      
      for (const [color, count] of Object.entries(colorMap)) {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      }
      
      // Boost saturation and vibrance of the extracted color
      const [r, g, b] = dominantColor.split(',').map(Number);
      const boostedColor = boostSaturation(r, g, b);
      
      callback(boostedColor);
    } catch (error) {
      console.warn('Error extracting color:', error);
      callback('59, 130, 246'); // Default blue on error
    }
  };
  
  img.onerror = () => {
    // Fallback to a hash-based color generation
    const hashColor = generateColorFromString(imageSrc);
    callback(hashColor);
  };
};

// Boost saturation and vibrance of a color
const boostSaturation = (r, g, b, boostFactor = 1.5) => {
  // Convert RGB to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Boost saturation (increase by boostFactor, cap at 1)
  s = Math.min(s * boostFactor, 1);
  
  // Slightly adjust lightness for more vibrance
  if (l < 0.5) {
    l = Math.min(l * 1.1, 0.5);
  } else {
    l = Math.max(l * 0.9, 0.5);
  }
  
  // Convert back to RGB
  const hslToRgb = (h, s, l) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
  };
  
  return hslToRgb(h, s, l);
};

// Generate a vibrant color based on string hash (fallback for CORS issues)
const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate vibrant colors with high saturation
  const h = Math.abs(hash % 360);
  const s = 75 + (Math.abs(hash) % 25); // 75-100% saturation (more vibrant)
  const l = 50 + (Math.abs(hash >> 8) % 15); // 50-65% lightness
  
  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4))
    ].join(', ');
  };
  
  return hslToRgb(h, s, l);
};

const Recomended = ({categoryId}) => {
  const [apiData, setApiData] = useState([])
  const [thumbnailColors, setThumbnailColors] = useState({});

  const fetchRecommendedVideos = async () => {
    try {
      let url;
      
      if (categoryId === "0" || !categoryId) {
        // For Home category or no category, get most popular videos
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=50&key=${API_KEY}`;
      } else {
        // For specific categories
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&videoCategoryId=${categoryId}&maxResults=50&key=${API_KEY}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items) {
        setApiData(data.items);
        
        // Extract colors for each thumbnail
        data.items.forEach((item) => {
          const thumbnailUrl = item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url;
          if (thumbnailUrl) {
            extractDominantColor(thumbnailUrl, (color) => {
              setThumbnailColors(prev => ({
                ...prev,
                [item.id]: color
              }));
            });
          }
        });
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
        apiData.map((video, index) => {
          const bgColor = thumbnailColors[video.id] || generateColorFromString(video.id);
          
          return (
            <Link 
              key={video.id || index} 
              to={`/video/${video.snippet.categoryId}/${video.id}`}
              className="flex space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(${bgColor}, 0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
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
                <h4 className="text-md font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
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
          );
        })
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading recommended videos...</p>
        </div>
      )}
    </div>
  )
}

export default Recomended