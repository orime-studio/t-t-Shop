import { useEffect, useState } from 'react';
import axios from 'axios';

function LatestVideo() {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            channelId: 'YOUR_CHANNEL_ID',
            part: 'snippet',
            order: 'date',
            maxResults: 1,
          },
        });
      
        const video = response.data.items?.[0];
        if (!video || !video.id) {
          throw new Error('No video found or invalid response structure');
        }
      
        return video.id.videoId;
      };

      fetchLatestVideo();
  }, []);

  return (
    <div>
      {videoUrl ? (
        <iframe
          width="560"
          height="315"
          src={videoUrl.replace('watch?v=', 'embed/')}
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
