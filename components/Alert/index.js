import React from 'react';

export default function Alert({ type, message }) {
  const typeColor = (alertType) => {
    switch (alertType) {
      case 'error':
        return 'pink';
      case 'success':
        return 'green';
      default:
        return 'lightBlue';
    }
  };

  const tipText = (alertType) => {
    switch (alertType) {
      case 'error':
        return 'Error';
      case 'success':
        return 'Success';
      default:
        return 'Note';
    }
  };
  return (
    <div className="fixed bottom-4 left-4">
      <div
        className={`inline-flex items-center bg-white leading-none text-${typeColor(
          type
        )}-600 rounded-full p-4 shadow text-teal text-sm`}>
        <span
          className={`inline-flex bg-${typeColor(
            type
          )}-600 text-white rounded-full h-6 px-3 justify-center items-center`}>
          {tipText(type)}
        </span>
        <span className="inline-flex px-2">{message}</span>
      </div>
    </div>
  );
}
