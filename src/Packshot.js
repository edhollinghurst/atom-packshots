import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import PackshotContent from './PackshotContent';

const Packshot = ({
  id,
  url,
  groupName,
  selectedMembers,
  onMove,
  onDragStart,
  onDragComplete,
  onSelectionChange,
}) => {
  const [draggedMembers, setDraggedMembers] = React.useState([]);

  const [, drag] = useDrag({
    item: {
      type: ItemTypes.PACKSHOT,
      id,
    },
    begin: (monitor) => {
      let updatedMembers;
      const draggedMember = { id, url, groupName };
      if (selectedMembers.find((member) => member.id === id)) {
        updatedMembers = selectedMembers;
      } else {
        updatedMembers = [draggedMember];
      }
      setDraggedMembers(updatedMembers);
      onDragStart({
        members: updatedMembers,
        draggedMember: { id, url, groupName },
      });
    },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      const dragItem = {
        draggedMember: { id, url, groupName },
        members: draggedMembers,
      };
      onDragComplete({
        dragItem,
        didDrop,
      });
    },
  });

  const [, drop] = useDrop({
    accept: [ItemTypes.PACKSHOT],
    hover(item, monitor) {
      const pointerOffset = monitor.getClientOffset();
      onMove(item, id, pointerOffset);
    },
  });

  const onClick = (e) => {
    onSelectionChange(id, e.metaKey, e.shiftKey);
  };

  return (
    <div ref={drop}>
      <div ref={drag} className="card" onClick={onClick}>
        <PackshotContent url={url} />
      </div>
    </div>
  );
};

export default Packshot;
