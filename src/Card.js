import React from 'react';

const Card = ({ className, children }) => {
  return (
    <div className={`rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
