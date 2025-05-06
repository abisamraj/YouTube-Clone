import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Video.css'
import Playvideo from '../../Components/Playvideo/Playvideo'
import Recommended from '../../Components/Recommended/Recommended'

const Video = () => {
  const { videoId, categoryId } = useParams();
  const navigate = useNavigate();

  if (!videoId) {
    return (
      <div className="error-message">
        No video ID found in URL. <button onClick={() => navigate('/')}>Go back to home</button>
      </div>
    );
  }

  return (
    <div className='play-container'>
      <Playvideo videoId={videoId} categoryId={categoryId} />
      <Recommended categoryId={categoryId} />
    </div>
  );
};

export default Video;
