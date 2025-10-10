// import React, { useEffect, useState } from "react";

// import { Link } from "react-router-dom";
// import { API_KEY } from "../data";
// import { formatViewCount, formatPublishedDate, formatDuration } from "../utils/formatters";

// const Feed = ({ category = "0" }) => {
//   const [data, setData] = useState([]);
  
//   // Debug log to see what category is being passed
//   console.log("Feed component received category:", category, "type:", typeof category);

//   const fetchData = async () => {
//     try {
//       let videoListUrl;
      
//       // Handle undefined, null, or "0" category as Home
//       if (!category || category === "0" || category === 0) {
//         // For Home category, get most popular videos without category filter
//         videoListUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=IN&key=${API_KEY}`;
//       } else {
//         // For specific categories - ensure category is a valid string
//         const categoryId = String(category);
//         videoListUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=IN&videoCategoryId=${categoryId}&key=${API_KEY}`;
//       }
      
//       console.log("Fetching URL:", videoListUrl); // Debug log
      
//       const response = await fetch(videoListUrl);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.items) {
//         setData(data.items);
//       } else {
//         console.warn("No items found in response:", data);
//         setData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//       setData([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [category]);



//   return (
//     <div className="p-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
//         {data.map((item, idx) => (
//           <Link to={`video/${item.snippet.categoryId}/${item.id}`} key={item.id || idx} className="cursor-pointer group hover:bg-amber-300 rounded-xl">
//             <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 ">
//               <img
//                 src={item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url}
//                 alt={item.snippet.title}
//                 className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
//               />
//               {item.contentDetails?.duration && (
//                 <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
//                   {formatDuration(item.contentDetails.duration)}
//                 </div>
//               )}
//             </div>
//             <div className="mt-3 mx-2">
//               <h2 className="text-sm font-semibold leading-snug line-clamp-2">
//                 {item.snippet.title}
//               </h2>
//               <h3 className="text-xs text-gray-600 mt-1">{item.snippet.channelTitle}</h3>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {formatViewCount(parseInt(item.statistics?.viewCount || 0))} views • {formatPublishedDate(item.snippet.publishedAt)}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Feed;



import React, { useEffect, useState } from "react";
import thumbnail1 from "../assets/thumbnail1.png";
import thumbnail2 from "../assets/thumbnail2.png";
import thumbnail3 from "../assets/thumbnail3.png";
import thumbnail4 from "../assets/thumbnail4.png";
import thumbnail5 from "../assets/thumbnail5.png";
import thumbnail6 from "../assets/thumbnail6.png";
import thumbnail7 from "../assets/thumbnail7.png";
import thumbnail8 from "../assets/thumbnail8.png";
import { Link } from "react-router-dom";
import { API_KEY } from "../data";
import { formatViewCount, formatPublishedDate, formatDuration } from "../utils/formatters";

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

const Feed = ({ category = "0" }) => {
  const [data, setData] = useState([]);
  const [thumbnailColors, setThumbnailColors] = useState({});
  
  console.log("Feed component received category:", category, "type:", typeof category);

  const fetchData = async () => {
    try {
      let videoListUrl;
      
      if (!category || category === "0" || category === 0) {
        videoListUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`;
      } else {
        const categoryId = String(category);
        videoListUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
      }
      
      console.log("Fetching URL:", videoListUrl);
      
      const response = await fetch(videoListUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.items) {
        setData(data.items);
        
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
      } else {
        console.warn("No items found in response:", data);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (
    <div className="p-0 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
        {data.map((item, idx) => {
          const bgColor = thumbnailColors[item.id] || generateColorFromString(item.id);
          
          return (
            <Link 
              to={`video/${item.snippet.categoryId}/${item.id}`} 
              key={item.id || idx} 
              className="cursor-pointer group rounded-xl pb-1 transition-transform duration-300 ease-in-out hover:scale-105 "
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(${bgColor}, 0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="relative w-full overflow-hidden rounded-xl">
                <img
                  src={item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url}
                  alt={item.snippet.title}
                  className="w-full p-2 h-auto object-cover rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
                />
                {item.contentDetails?.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(item.contentDetails.duration)}
                  </div>
                )}
              </div>
              <div className="mt-3 mx-2">
                <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                  {item.snippet.title}
                </h2>
                <h3 className="text-xs text-gray-600 mt-1">{item.snippet.channelTitle}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatViewCount(parseInt(item.statistics?.viewCount || 0))} views • {formatPublishedDate(item.snippet.publishedAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;