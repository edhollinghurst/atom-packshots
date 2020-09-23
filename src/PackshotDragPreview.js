import React from 'react';
import PackshotContent from './PackshotContent';

const PackshotDragPreview = ({ members }) => {
  return (
    <div>
      {members.slice(0, 3).map((member, i) => (
        <div
          key={member.id}
          className="card card-dragged"
          style={{
            zIndex: members.length - i,
            transform: `rotateZ(${-i * 2.5}deg)`,
          }}
        >
          <PackshotContent url={member.url} />
        </div>
      ))}
    </div>
  );
};

export default PackshotDragPreview;
