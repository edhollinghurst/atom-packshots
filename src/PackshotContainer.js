import React from 'react';
import PackshotWrapper from './PackshotWrapper';
import PackshotDragLayer from './PackshotDragLayer';
import Packshot from './Packshot';

const getNodeClientBounds = (node) => {
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el) {
    return null;
  }
  return el.getBoundingClientRect();
};

const PackshotContainer = ({
  groupName,
  members: membersData,
  insertIndex,
  hoveredMemberId,
  hoveredMemberIndex,
  targetGroup,
  setInsertIndex,
  setHoveredMemberId,
  setHoveredMemberIndex,
  setTargetGroup,
  onDragComplete,
}) => {
  const [members, setMembers] = React.useState([]);
  const [draggedMemberIds, setDraggedMemberIds] = React.useState([]);
  const [selectedMembers, setSelectedMembers] = React.useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = React.useState([]);
  const [activeMemberId, setActiveMemberId] = React.useState();
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const updatedMembers = [...membersData];
    setMembers(updatedMembers);

    // TODO:
    // 1. Is there way to avoid using setTimeout?
    // 2. Need to recaluctate bounds on window resize - useLayoutEffect?
    setTimeout(() => {
      const childNodesArr = Array.from(containerRef.current.childNodes);
      childNodesArr.map((child, i) => {
        updatedMembers[i].bounds = getNodeClientBounds(child);
      });
      setMembers(updatedMembers);
    }, 0);
  }, [membersData]);

  const onMemberDragStart = (dragItem) => {
    const updatedDraggedMemberIds = dragItem.members.map((c) => c.id);
    setDraggedMemberIds(updatedDraggedMemberIds);
    setSelectedMembers(dragItem.members);
    setSelectedMemberIds(updatedDraggedMemberIds);
    setActiveMemberId(dragItem.draggedMember.id);
  };

  // Drop Target / useDrop function
  const onMemberMove = (dragItem, hoverId, pointerOffset) => {
    const { id: dragId } = dragItem.draggedMember;
    const hoverIndex = members.findIndex((el) => el.id === hoverId);
    const hoverMember = members[hoverIndex];

    const midX =
      hoverMember.bounds.left +
      (hoverMember.bounds.right - hoverMember.bounds.left) / 2;
    const insertIndex = pointerOffset.x < midX ? hoverIndex : hoverIndex + 1;

    let previousDragId, previousHoverId, previousInsertIndex;
    if (
      previousDragId === dragId &&
      previousHoverId === hoverId &&
      previousInsertIndex === insertIndex
    ) {
      return;
    }
    previousDragId = dragId;
    previousHoverId = hoverId;
    previousInsertIndex = insertIndex;

    setInsertIndex(insertIndex);
    setHoveredMemberId(hoverId);
    setHoveredMemberIndex(hoverIndex);
    setTargetGroup(groupName);
  };

  // DragSource / UseDrag function
  const onMemberDragComplete = (dragItem) => {
    setDraggedMemberIds([]);
    onDragComplete(dragItem);
    setTargetGroup(null);
  };

  const onMemberSelectionChange = (memberId, cmdKeyActive, shiftKeyActive) => {
    let updatedSelectedMemberIds = [];
    let updatedActiveMemberId;

    let previousSelectedMemberIds = [...selectedMemberIds];
    let previousActiveMemberId = activeMemberId;

    if (cmdKeyActive) {
      if (
        previousSelectedMemberIds.indexOf(memberId) > -1 &&
        memberId !== previousActiveMemberId
      ) {
        updatedSelectedMemberIds = previousSelectedMemberIds.filter(
          (id) => id !== memberId
        );
      } else {
        updatedSelectedMemberIds = [...previousSelectedMemberIds, memberId];
      }
    } else if (shiftKeyActive && memberId !== previousActiveMemberId) {
      const activeMemberIndex = members.findIndex(
        (c) => c.id === previousActiveMemberId
      );
      const memberIndex = members.findIndex((c) => c.id === memberId);
      const lowerIndex = Math.min(activeMemberIndex, memberIndex);
      const upperIndex = Math.max(activeMemberIndex, memberIndex);
      updatedSelectedMemberIds = [...members]
        .slice(lowerIndex, upperIndex + 1)
        .map((c) => c.id);
    } else {
      updatedSelectedMemberIds = [memberId];
      updatedActiveMemberId = memberId;
    }

    const updatedSelectedMembers = members.filter((c) =>
      updatedSelectedMemberIds.includes(c.id)
    );

    if (updatedActiveMemberId) {
      setActiveMemberId(updatedActiveMemberId);
    }
    setSelectedMembers(updatedSelectedMembers);
    setSelectedMemberIds(updatedSelectedMemberIds);
  };

  return (
    <main>
      <PackshotDragLayer />
      <div className="container" ref={containerRef}>
        {members.map((member, i) => {
          const prevMember = i > 0 ? members[i - 1] : null;
          const nextMember = i < members.length ? members[i + 1] : null;

          const isDragging = draggedMemberIds.includes(member.id);
          const isDraggingPrevMember =
            !!prevMember && draggedMemberIds.includes(prevMember.id);
          const isDraggingNextMember =
            !!nextMember && draggedMemberIds.includes(nextMember.id);

          const shouldInsertLineOnLeft =
            groupName === targetGroup &&
            !isDragging &&
            !isDraggingPrevMember &&
            hoveredMemberIndex === i &&
            insertIndex === i;

          const shouldInsertLineOnRight =
            groupName === targetGroup &&
            !isDragging &&
            !isDraggingNextMember &&
            hoveredMemberIndex === i &&
            insertIndex === i + 1;

          const shouldInsertLineOnRightOfPrevMember =
            groupName === targetGroup &&
            !!prevMember &&
            !isDraggingPrevMember &&
            hoveredMemberIndex === i - 1 &&
            insertIndex === i;
          const shouldInsertLineOnLeftOfNextMember =
            groupName === targetGroup &&
            !!nextMember &&
            !isDraggingNextMember &&
            hoveredMemberIndex === i + 1 &&
            insertIndex === i + 1;

          const isHovered =
            hoveredMemberId === member.id ||
            shouldInsertLineOnRightOfPrevMember ||
            shouldInsertLineOnLeftOfNextMember;

          return (
            <div
              key={'member-div-' + member.id}
              style={{ position: 'relative' }}
            >
              {shouldInsertLineOnLeft && <div className="insert-line-left" />}
              <PackshotWrapper
                key={'member-wrapper-' + member.id}
                isDragging={isDragging}
                isActive={activeMemberId === member.id}
                isHovered={isHovered}
                isSelected={selectedMemberIds.includes(member.id)}
              >
                <Packshot
                  key={'member-' + member.id}
                  id={member.id}
                  url={member.url}
                  groupName={groupName}
                  selectedMembers={selectedMembers}
                  onMove={onMemberMove}
                  onDragStart={onMemberDragStart}
                  onDragComplete={onMemberDragComplete}
                  onSelectionChange={onMemberSelectionChange}
                />
              </PackshotWrapper>
              {shouldInsertLineOnRight && <div className="insert-line-right" />}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default React.memo(PackshotContainer);
