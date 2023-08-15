/* eslint-disable */
import React from 'react';
import { Modal } from 'antd';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './storyVideo.css';
import ReactPlayer from 'react-player'

interface VideoPreviewProps {
  videoUrl?: string;
  visible: boolean;
  handleCancel: () => void;
}
const VideoPreviewModal: React.FC<VideoPreviewProps> = ({
  videoUrl,
  visible,
  handleCancel,
}): JSX.Element => {
  return (
    <Modal
      visible={visible}
      title={L('StoryVideo')}
      onCancel={handleCancel}
      centered
      destroyOnClose
      maskClosable={false}
      width="60%"
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
     
      {videoUrl && (
        <ReactPlayer url={videoUrl}  
                      playing
                      controls={true}
                      autoPlay
                      width="100%"
                      />
      )}
    </Modal>
  );
};

export default VideoPreviewModal;
