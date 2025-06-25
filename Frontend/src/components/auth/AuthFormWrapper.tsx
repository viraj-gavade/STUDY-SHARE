import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthFormWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  footerText?: string;
  footerLink?: {
    text: string;
    to: string;
  };
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({
  children,
  title,
  description,
  footerText,
  footerLink,
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600">StudyShare</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>

        {footerText && footerLink && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {footerText}{' '}
              <Link
                to={footerLink.to}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {footerLink.text}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFormWrapper;
