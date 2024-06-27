import React from 'react';

const CardContent = ({ className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default CardContent;
