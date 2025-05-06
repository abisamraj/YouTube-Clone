import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SearchResults.css';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { Link } from 'react-router-dom';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            
            setLoading(true);
            try {
                const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=40&q=${query}&type=video&key=${API_KEY}`;
                const response = await fetch(searchUrl);
                const data = await response.json();

                if (data.error) {
                    setError(data.error.message);
                    return;
                }

                // Get video details for each search result
                const videoIds = data.items.map(item => item.id.videoId).join(',');
                const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
                const videoDetailsResponse = await fetch(videoDetailsUrl);
                const videoDetails = await videoDetailsResponse.json();

                setSearchResults(videoDetails.items);
            } catch (err) {
                setError('Failed to fetch search results');
                console.error('Error fetching search results:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <div className="loading">Loading search results...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="search-results">
            <h2>Search Results for: {query}</h2>
            <div className="results-grid">
                {searchResults.map((video) => (
                    <Link 
                        to={`/video/${video.snippet.categoryId}/${video.id}`} 
                        className="result-card" 
                        key={video.id}
                    >
                        <img 
                            src={video.snippet.thumbnails.medium.url} 
                            alt={video.snippet.title} 
                        />
                        <div className="result-info">
                            <h3>{video.snippet.title}</h3>
                            <p className="channel">{video.snippet.channelTitle}</p>
                            <p className="views">
                                {value_converter(video.statistics.viewCount)} views • 
                                {moment(video.snippet.publishedAt).fromNow()}
                            </p>
                            <p className="description">{video.snippet.description.slice(0, 100)}...</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchResults; 