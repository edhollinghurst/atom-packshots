import React from 'react';

const PackshotWrapper = ({
  isDragging,
  isSelected,
  isActive,
  isHovered,
  children,
}) => {
  const styleClasses = [];
  if (isActive) {
    styleClasses.push('card-wrapper-active');
  }
  if (isSelected) {
    styleClasses.push('card-wrapper-selected');
  }
  if (isDragging) {
    styleClasses.push('card-wrapper-dragging');
  }
  if (isHovered) {
    styleClasses.push('card-wrapper-hovered');
  }

  return (
    <div className={'card-wrapper ' + styleClasses.join(' ')}>{children}</div>
  );
};

export default React.memo(PackshotWrapper);
