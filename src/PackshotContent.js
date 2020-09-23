import React from 'react';

const PackshotContent = ({ url }) => (
  <div className="card-outer">
    <div className="card-inner">
      <img src={url} width="80" height="45" draggable="false" />
    </div>
  </div>
);

export default PackshotContent;
