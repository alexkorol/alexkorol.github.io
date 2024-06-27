import React from 'react';

const CardHeader = ({ className, children }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardHeader;
