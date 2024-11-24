import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://node-tandt-shop.onrender.com/api/v1/videos/latest-video';

function LatestVideo() {
  const [videoUrl, setVideoUrl] = useState(null);

  // פונקציה להמרת URL לפורמט Embed
  const getEmbedUrl = (url) => {
    if (url && url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return null; // החזר null אם הפורמט שגוי
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(API_URL);
        const videoUrl = response.data.videoUrl;

        // בדיקת פורמט ה-URL
        if (videoUrl && videoUrl.includes('watch?v=')) {
          console.log('Valid YouTube URL:', videoUrl);
          setVideoUrl(videoUrl);
        } else {
          console.error('Invalid YouTube URL:', videoUrl);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, []);

  return (
    <div>
      {videoUrl ? (
        <iframe
          width="560"
          height="315"
          src={getEmbedUrl(videoUrl)} // המרת URL ל-Embed URL
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default LatestVideo;
