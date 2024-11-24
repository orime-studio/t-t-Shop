import { useEffect, useState } from 'react';
import axios from 'axios';

function LatestVideo() {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get('https://node-tandt-shop.onrender.com/api/v1/videos/latest-video');
        setVideoUrl(response.data.videoUrl);
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
