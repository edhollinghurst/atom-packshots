import React, { Component } from 'react';
import { compose } from 'redux';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from './ItemTypes';
import PackshotContent from './PackshotContent';

const memberSource = {
  beginDrag(props) {
    const { id, url, groupName } = props;
    const draggedMember = { id, url, groupName };
    let members;
    if (props.selectedMembers.find((member) => member.id === props.id)) {
      members = props.selectedMembers;
    } else {
      members = [draggedMember];
    }
    const otherMembers = members.concat();
    otherMembers.splice(
      members.findIndex((c) => c.id === props.id),
      1
    );
    const membersDragStack = [draggedMember, ...otherMembers];
    return { members, membersDragStack, draggedMember };
  },

  endDrag(props, monitor) {
    props.onDragComplete(monitor.getItem());
  },
};

const memberTarget = {
  hover(props, monitor, component) {
    const item = monitor.getItem();
    const pointerOffset = monitor.getClientOffset();
    const hoverId = props.id;
    props.onMove(item, hoverId, pointerOffset);
  },
};

const withDropTarget = DropTarget(
  ItemTypes.PACKSHOT,
  memberTarget,
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
);

const withDragSource = DragSource(
  ItemTypes.PACKSHOT,
  memberSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
  })
);

class Packshot extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true,
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('componentWillReceiveProps', nextProps);
    if (!this.props.isDragging && nextProps.isDragging) {
      this.props.onDragStart(nextProps.item);
    }
  }

  onClick(e) {
    this.props.onSelectionChange(this.props.id, e.metaKey, e.shiftKey);
  }

  render() {
    if (this.renderCache) {
      return this.renderCache;
    }

    const { url, connectDragSource, connectDropTarget } = this.props;

    this.renderCache = connectDragSource(
      connectDropTarget(
        <div
          ref={(node) => (this.node = node)}
          className="card"
          onClick={this.onClick}
        >
          <PackshotContent url={url} />
        </div>
      )
    );

    return this.renderCache;
  }
}

export default compose(withDropTarget, withDragSource)(Packshot);
