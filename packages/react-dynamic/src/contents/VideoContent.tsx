import React from 'react';
import component from '@ohoareau/react-component';
import ReactPlayer from 'react-player';

export const VideoContent = component<VideoContentProps>(undefined, ({url}: VideoContentProps) => (
    <ReactPlayer width={'100%'} url={url} />
));

export interface VideoContentProps {
    url: string,
}

export default VideoContent