import React from 'react';
import { DragLayer } from 'react-dnd';
import ItemTypes from './ItemTypes';
import PackshotDragPreview from './PackshotDragPreview';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

const getItemStyles = (currentOffset) => {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
    filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.45))',
  };
};

const collect = (monitor) => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
});

class PackshotDragLayer extends React.Component {
  renderItem(type, item) {
    switch (type) {
      case ItemTypes.PACKSHOT:
        return <PackshotDragPreview members={item.membersDragStack} />;
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, currentOffset, isDragging } = this.props;

    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(currentOffset)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}

export default DragLayer(collect)(PackshotDragLayer);
