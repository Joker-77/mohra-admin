/* eslint-disable */
import * as React from 'react';
import { Tag, Image, Spin, Modal, Table } from 'antd';
import moment from 'moment';

import { L } from '../../../i18next';
import timingHelper from '../../../lib/timingHelper';
import localization from '../../../lib/localization';
import { ExerciseType } from '../../../lib/types';
import { DailySessionDto } from '../../../services/clients/dto/clientDto';
import { YoutubeOutlined } from '@ant-design/icons';
import VideoPreviewModal from '../../Stories/components/VideoPreviewModal';

interface SessionDetailsModalProps {
  loading: boolean;
  data?: DailySessionDto;
  visible: boolean;
  onCancel: () => void;
}

const SessionDetails: React.FC<SessionDetailsModalProps> = ({
  loading,
  visible,
  onCancel,
  data,
}) => {
  const excercisesTableColumns = [
    {
      title: L('Id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: L('DurationInMinutes'),
      dataIndex: 'durationInMinutes',
      key: 'durationInMinutes',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => {
        return (<div className="video-preview" style={{ width: 'fit-content', display: 'inline-block' }}>
            {imageUrl.indexOf('.png') > -1 ||
            imageUrl.indexOf('.webp') > -1 ||
            imageUrl.indexOf('.jpeg') > -1 ||
            imageUrl.indexOf('.jpg') > -1 ? (
            <Image preview={!!imageUrl} width={50} height={50} src={imageUrl} alt={L('Image')} />
          ) : (
            <YoutubeOutlined
              style={{ fontSize: 40 }}
              onClick={() => openVideoModal(imageUrl)}
            />
          )}
        </div>);
      },
    },
    {
      title: L('SessionsCount'),
      dataIndex: 'sessionsCount',
      key: 'sessionsCount',
    },
    {
      title: L('Type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: ExerciseType) => {
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {type === ExerciseType.MainWorkout
              ? L('MainWorkout')
              : ExerciseType.WarmUp
                ? L('WarmUp')
                : L('CoolDown')}
          </Tag>
        );
      },
    },
  ];

  const [videoModalVisible, setVideoModalVisible] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState("");

  const openVideoModal = (_videoUrl: string): void => {
    setVideoUrl(_videoUrl);
    setVideoModalVisible(true);
    
  };
  const handleCancelVideoModal = (): void => {
    setVideoModalVisible(false);
  };

  const { id, creationTime, session, trainingKcal, walkingKcal } = data || {};

  return (<>
      <VideoPreviewModal
        handleCancel={handleCancelVideoModal }
        videoUrl={videoUrl}
        visible={videoModalVisible}
      />
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('SessionDetails')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      <div className="scrollable-modal">
        {loading ? (
          <div className="loading-comp">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="details-wrapper">
              <div className="detail-wrapper">
                <span className="detail-label">{L('Id')}:</span>
                <span className="detail-value">{id}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Title')}:</span>
                <span className="detail-value">{session && session.title}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('Image')}:</span>
                <span className="detail-value">
                  {session && (
                    <Image
                      preview={!!session.imageUrl}
                      width={50}
                      height={50}
                      src={session.imageUrl}
                      alt={L('Image')}
                    />
                  )}
                </span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('SessionTime')}:</span>
                <span className="detail-value">{session && session.timeInMinutes}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('AmountOfCalories')}:</span>
                <span className="detail-value">{session && session.amountOfCalories}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('WalkingKcal')}:</span>
                <span className="detail-value">{walkingKcal}</span>
              </div>
              <div className="detail-wrapper">
                <span className="detail-label">{L('TrainingKcal')}:</span>
                <span className="detail-value">{trainingKcal}</span>
              </div>

              <div className="detail-wrapper">
                <span className="detail-label">{L('CreationDate')}</span>
                <span className="detail-value">
                  {creationTime && moment(creationTime).format(timingHelper.defaultDateTimeFormat)}
                </span>
              </div>
            </div>

            <div className="details-wrapper">
              <div className="detail-wrapper booking-list">
                <span className="detail-label">{L('ExcersisesList')}:</span>
                <Table
                  className="event-table"
                  rowKey={(record) => `${record.id}`}
                  dataSource={(session && session.exercises) || []}
                  columns={excercisesTableColumns}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  </>);
};

export default SessionDetails;
