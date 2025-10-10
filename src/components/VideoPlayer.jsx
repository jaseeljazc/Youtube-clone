import React, { useEffect, useState } from "react";
import video from "../assets/video.mp4";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import save from "../assets/save.png";
import share from "../assets/share.png";
import jack from "../assets/jack.png";
import user_profile from "../assets/user_profile.jpg";
import { API_KEY } from "../data";
import {
  formatViewCount,
  formatSubscriberCount,
  formatPublishedDate,
  formatLikeCount,
} from "../utils/formatters";
import { useParams } from "react-router-dom";

const items = [
  {
    img: like,
    text: 1200,
  },
  {
    img: dislike,
    text: 45,
  },
  {
    img: save,
    text: "Save",
  },
  {
    img: share,
    text: "Share",
  },
];

const VideoPlayer = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch video data
      const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
      const videoResponse = await fetch(videoUrl);
      const videoData = await videoResponse.json();

      if (videoData.items?.[0]) {
        const video = videoData.items[0];
        setApiData(video);

        // Fetch channel data
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${video.snippet.channelId}&key=${API_KEY}`;
        const channelResponse = await fetch(channelUrl);
        const channelData = await channelResponse.json();

        if (channelData.items?.[0]) {
          setChannelData(channelData.items[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=50&key=${API_KEY}`;
      const response = await fetch(commentsUrl);
      const data = await response.json();

      if (data.items) {
        setCommentData(data.items);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchData();
      fetchComments();
    }
  }, [videoId]);

  if (!apiData) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-white">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      {/* Video Player */}
      <div className="mb-4 relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          title="YouTube video player"
        ></iframe>
      </div>

      {/* Video Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
        {apiData.snippet?.title}
      </h3>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-200">
        <p className="text-gray-600 text-sm mb-3 sm:mb-0">
          {formatViewCount(parseInt(apiData.statistics?.viewCount || 0))} views
          • {formatPublishedDate(apiData.snippet?.publishedAt)}
        </p>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors duration-200">
            <img src={like} alt="Like" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">
              {formatLikeCount(parseInt(apiData.statistics?.likeCount || 0))}
            </span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors duration-200">
            <img src={dislike} alt="Dislike" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Dislike</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors duration-200">
            <img src={save} alt="Save" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Save</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors duration-200">
            <img src={share} alt="Share" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Share</span>
          </button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={channelData?.snippet?.thumbnails?.default?.url || jack}
            alt="Channel Avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900">
              {apiData.snippet?.channelTitle}
            </p>
            <span className="text-sm text-gray-600">
              {channelData?.statistics?.subscriberCount
                ? formatSubscriberCount(
                    parseInt(channelData.statistics.subscriberCount)
                  )
                : "Subscribers"}
            </span>
          </div>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors duration-200">
          Subscribe
        </button>
      </div>

      {/* Video Description */}
      <div className="mb-6">
        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {apiData.snippet?.description || "No description available"}
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {apiData.statistics?.commentCount
            ? `${parseInt(
                apiData.statistics.commentCount
              ).toLocaleString()} comments`
            : "Comments"}
        </h4>

        {commentData && commentData.length > 0 ? (
          commentData.map((comment, index) => (
            <div key={comment.id || index} className="flex space-x-3 mb-6">
              <img
                src={
                  comment.snippet?.topLevelComment?.snippet
                    ?.authorProfileImageUrl || user_profile
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full flex-shrink-0"
                onError={(e) => {
                  e.target.src = user_profile;
                }}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {comment.snippet?.topLevelComment?.snippet
                      ?.authorDisplayName || "Anonymous"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatPublishedDate(
                      comment.snippet?.topLevelComment?.snippet?.publishedAt
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed mb-2">
                  {comment.snippet?.topLevelComment?.snippet?.textDisplay ||
                    "No comment text"}
                </p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                    <img src={like} alt="Like" className="w-4 h-4" />
                    <span className="text-xs text-gray-600">
                      {comment.snippet?.topLevelComment?.snippet?.likeCount ||
                        0}
                    </span>
                  </button>
                  <button className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                    <img src={dislike} alt="Dislike" className="w-4 h-4" />
                    <span className="text-xs text-gray-600">0</span>
                  </button>
                  <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No comments available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
