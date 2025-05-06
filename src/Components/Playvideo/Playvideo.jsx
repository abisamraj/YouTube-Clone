import React, { useEffect, useState } from 'react'
import './Playvideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'

const Playvideo = ({ videoId, categoryId }) => {
    const [videoData, setVideoData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
                const response = await fetch(videoDetails_url);
                const data = await response.json();
                
                if (data.error) {
                    setError(data.error.message);
                    return;
                }
                
                if (data.items && data.items.length > 0) {
                    setVideoData(data.items[0]);
                } else {
                    setError('Video not found');
                }
            } catch (err) {
                setError('Failed to fetch video data');
                console.error('Error fetching video:', err);
            }
        };
        fetchVideoData();
    }, [videoId, categoryId]);

    useEffect(() => {
        const fetchOtherData = async () => {
            if (videoData) {
                try {
                    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${videoData.snippet.channelId}&key=${API_KEY}`;
                    const channelResponse = await fetch(channelData_url);
                    const channelData = await channelResponse.json();
                    setChannelData(channelData.items[0]);

                    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&maxResults=10&key=${API_KEY}`;
                    const commentResponse = await fetch(comment_url);
                    const commentData = await commentResponse.json();
                    setCommentData(commentData.items || []);
                } catch (err) {
                    console.error('Error fetching additional data:', err);
                }
            }
        };
        fetchOtherData();
    }, [videoData, videoId]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!videoData) {
        return <div className="loading-message">Loading...</div>;
    }

    const displayedComments = showAllComments ? commentData : commentData.slice(0, 10);

    return (
        <div className='play-video'>
            <div className="video-container">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={videoData.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0 }}
                ></iframe>
            </div>
            <h3>{videoData.snippet.title}</h3>
            <div className="play-video-info">
                <p>{value_converter(videoData.statistics.viewCount)} Views &bull; {moment(videoData.snippet.publishedAt).fromNow()}</p>
                <div>
                    <span><img src={like} alt="" />{value_converter(videoData.statistics.likeCount)}</span>
                    <span><img src={dislike} alt="" />{value_converter(videoData.statistics.dislikeCount)}</span>
                    <span><img src={share} alt="" />Share</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={videoData.snippet.thumbnails.default.url} alt="" />
                <div>
                    <p>{videoData.snippet.channelTitle}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : 'Loading...'} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="video-description">
                <p>{videoData.snippet.description.slice(0, 250)}</p>
                <hr />
                <h4>{value_converter(videoData.statistics.commentCount)} Comments</h4>
                <div className="comments-section">
                    {displayedComments && displayedComments.length > 0 ? (
                        <>
                            {displayedComments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <img 
                                        src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} 
                                        alt="commenter avatar" 
                                    />
                                    <div className="comment-content">
                                        <h3>
                                            {comment.snippet.topLevelComment.snippet.authorDisplayName}
                                            <span>{moment(comment.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                                        </h3>
                                        <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
                                        <div className="comment-actions">
                                            <span><img src={like} alt="" />{value_converter(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                                            <span><img src={dislike} alt="" />{value_converter(comment.snippet.topLevelComment.snippet.dislikeCount || 0)}</span>
                                            <span>Reply</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!showAllComments && commentData.length > 10 && (
                                <button className="show-more-btn" onClick={() => setShowAllComments(true)}>
                                    Show More Comments
                                </button>
                            )}
                        </>
                    ) : (
                        <p>No comments yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Playvideo;
