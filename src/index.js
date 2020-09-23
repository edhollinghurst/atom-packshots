import React from 'react';
import ReactDOM from 'react-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import PackshotContainer from './PackshotContainer.js';
import { staticMembers } from './data/static-members';
import { dynamicMembers } from './data/dynamic-members';
import './styles.css';

const staticMembersData = staticMembers.map((member) => ({
  id: member.id,
  url: member.images.imgUrl,
}));

const dynamicMembersData = dynamicMembers.map((member) => ({
  id: member.id,
  url: member.images.imgUrl,
}));

const App = () => {
  const [insertIndex, setInsertIndex] = React.useState(-1);
  const [hoveredMemberId, setHoveredMemberId] = React.useState(null);
  const [hoveredMemberIndex, setHoveredMemberIndex] = React.useState(-1);
  const [targetGroup, setTargetGroup] = React.useState(null);

  const [staticMembers, setStaticMembers] = React.useState(staticMembersData);
  const [dynamicMembers, setDynamicMembers] = React.useState(
    dynamicMembersData
  );

  // We would obviously handle this in Redux in actual implementation.
  const onDragComplete = (dragItem) => {
    const draggedMembers = dragItem.members;

    if (dragItem && dragItem.draggedMember.groupName === targetGroup) {
      let membersToUpdate;
      if (targetGroup === 'static-members') {
        membersToUpdate = [...staticMembers];
      } else if (targetGroup === 'dynamic-members') {
        membersToUpdate = [...dynamicMembers];
      }

      const remainingMembers = membersToUpdate.filter(
        (c) => !draggedMembers.find((dc) => dc.id === c.id)
      );

      // Figure out the insert position. This may differ from the insertIndex
      // if multiple members are dragged or item is being dragged to final position.
      let insertPosition = -1;
      if (insertIndex < membersToUpdate.length) {
        let index = insertIndex;
        do {
          const memberIdAtInsertIndex = membersToUpdate[index].id;
          insertPosition = remainingMembers.findIndex(
            (c) => c.id === memberIdAtInsertIndex
          );
          index += 1;
        } while (insertPosition < 0 && index < membersToUpdate.length);
      }
      if (insertPosition < 0) {
        // dragged to final position
        insertPosition = remainingMembers.length;
      }

      // Inject the dragged members into the correct position.
      remainingMembers.splice(insertPosition, 0, ...draggedMembers);

      if (targetGroup === 'static-members') {
        setStaticMembers(remainingMembers);
      } else if (targetGroup === 'dynamic-members') {
        setDynamicMembers(remainingMembers);
      }
    } else if (dragItem) {
      // Handle drag to another group
      let membersInDragSource = [];
      let membersInDropTarget = [];
      if (dragItem.draggedMember.groupName === 'static-members') {
        membersInDragSource = [...staticMembers];
      } else if (dragItem.draggedMember.groupName === 'dynamic-members') {
        membersInDragSource = [...dynamicMembers];
      }
      if (targetGroup === 'static-members') {
        membersInDropTarget = [...staticMembers];
      } else if (targetGroup === 'dynamic-members') {
        membersInDropTarget = [...dynamicMembers];
      }

      // Update members in drag source
      const updatedMembersInDragSource = membersInDragSource.filter(
        (c) => !draggedMembers.find((dc) => dc.id === c.id)
      );
      if (dragItem.draggedMember.groupName === 'static-members') {
        setStaticMembers(updatedMembersInDragSource);
      } else if (dragItem.draggedMember.groupName === 'dynamic-members') {
        setDynamicMembers(updatedMembersInDragSource);
      }

      // Update members in drop target
      const updatedMembersInDropTarget = [...membersInDropTarget];

      // Inject the dragged members into the correct position.
      updatedMembersInDropTarget.splice(insertIndex, 0, ...draggedMembers);

      if (targetGroup === 'static-members') {
        setStaticMembers(updatedMembersInDropTarget);
      } else if (targetGroup === 'dynamic-members') {
        setDynamicMembers(updatedMembersInDropTarget);
      }
    }
    setInsertIndex(-1);
    setHoveredMemberId(null);
    setHoveredMemberIndex(-1);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>static-members</h1>
      <PackshotContainer
        groupName="static-members"
        members={staticMembers}
        insertIndex={insertIndex}
        hoveredMemberId={hoveredMemberId}
        hoveredMemberIndex={hoveredMemberIndex}
        targetGroup={targetGroup}
        setInsertIndex={setInsertIndex}
        setHoveredMemberId={setHoveredMemberId}
        setHoveredMemberIndex={setHoveredMemberIndex}
        setTargetGroup={setTargetGroup}
        onDragComplete={onDragComplete}
      />
      <br />
      <h1>dynamic-members</h1>
      <PackshotContainer
        groupName="dynamic-members"
        members={dynamicMembers}
        insertIndex={insertIndex}
        hoveredMemberId={hoveredMemberId}
        hoveredMemberIndex={hoveredMemberIndex}
        targetGroup={targetGroup}
        setInsertIndex={setInsertIndex}
        setHoveredMemberId={setHoveredMemberId}
        setHoveredMemberIndex={setHoveredMemberIndex}
        setTargetGroup={setTargetGroup}
        onDragComplete={onDragComplete}
      />
      <br />
      <pre>
        {JSON.stringify({
          insertIndex,
          hoveredMemberId,
          hoveredMemberIndex,
          targetGroup,
        })}
      </pre>
    </DndProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
