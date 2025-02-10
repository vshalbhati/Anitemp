import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import TimelineEditor from '@xzdarcy/react-timeline-editor';
import PropTypes from 'prop-types';
import '@xzdarcy/react-timeline-editor/dist/style.css';

const Timeline = ({ 
  segments, 
  selectedSegment, 
  setSelectedSegment,
}) => {
  const [timelineRows, setTimelineRows] = useState(() => 
    segments.map((segment) => ({
      id: segment.id.toString(),
      name: `Segment ${segment.id}`,
      items: [{
        id: `item-${segment.id}`,
        start: 0,
        end: 5, // Default 5-second duration
        data: segment
      }]
    }))
  );

  const handleTimelineChange = (rows) => {
    setTimelineRows(rows);
  };

  const handleTimelineItemClick = (item) => {
    setSelectedSegment(item.data);
  };

  return (
    <div className="h-48 bg-white border-t border-gray-200 p-4">
      
      <div className="h-24">
        <TimelineEditor
          rows={timelineRows}
          onChange={handleTimelineChange}
          onItemClick={handleTimelineItemClick}
          editorData={{
            endTime: segments.length * 5, // Total duration based on number of segments
            timelineWidth: 1000,
            rowHeight: 48, // Adjusted to fit within container
          }}
          style={{
            background: 'white',
            color: '#374151',
          }}
          itemRender={({ item }) => (
            <div className="h-full w-full relative group">
              <video
                src={item.data.previewUrl || item.data.video}
                className="h-full w-full object-cover rounded"
              />
              <div className={`absolute inset-0 transition-all ${
                selectedSegment?.id === item.data.id 
                  ? 'ring-2 ring-purple-600 ring-offset-1' 
                  : 'group-hover:bg-black/20'
              }`}>
                <div className="absolute bottom-1 left-1 text-white text-xs">
                  Segment {item.data.id}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Timeline;Timeline.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      video: PropTypes.string.isRequired,
      previewUrl: PropTypes.string
    })
  ).isRequired,
  selectedSegment: PropTypes.shape({ id: PropTypes.number }),
  setSelectedSegment: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
};