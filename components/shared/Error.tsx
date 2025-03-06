import React from 'react';

type ErrorType = {
  status: number;
  message: string;
};

const Error = ({ status, message }: ErrorType) => {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-primary-50 px-4 pt-20">
      <div className="text-center bg-white rounded-lg shadow-lg border border-primary-100 p-6 w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {status} Error
        </h1>
        <p className="text-lg text-primary-700 mb-6">{message}</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default Error;