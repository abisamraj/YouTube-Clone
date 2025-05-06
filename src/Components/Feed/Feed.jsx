import React, { useEffect, useState } from 'react'
import './Feed.css'
import { Link } from 'react-router-dom'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
      const response = await fetch(videoList_url);
      const result = await response.json();
      
      if (result.error) {
        setError(result.error.message);
        return;
      }
      
      if (result.items && result.items.length > 0) {
        setData(result.items);
      } else {
        setError('No videos found');
      }
    } catch (err) {
      setError('Failed to fetch videos');
      console.error('Error fetching videos:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="feed">
      {data.map((item) => {
        if (!item || !item.id) return null;
        
        return (
          <Link 
            to={`/video/${category}/${item.id}`} 
            className='card' 
            key={item.id}
          >
            <img 
              src={item.snippet?.thumbnails?.medium?.url || ''} 
              alt={item.snippet?.title || 'Video thumbnail'} 
            />
            <h2>{item.snippet?.title || 'Untitled'}</h2>
            <h3>{item.snippet?.channelTitle || 'Unknown Channel'}</h3>
            <p>
              {value_converter(item.statistics?.viewCount || 0)} views &bull; 
              {moment(item.snippet?.publishedAt).fromNow()}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
