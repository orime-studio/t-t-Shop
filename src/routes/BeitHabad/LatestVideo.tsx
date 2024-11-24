// React component example

import { useEffect, useState } from 'react';

function LatestVideo() {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await fetch('/api/latest-video');
      const data = await response.json();
      setVideoUrl(data.videoUrl);
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
