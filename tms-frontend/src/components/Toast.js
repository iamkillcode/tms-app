import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-center"
    gutter={8}
    toastOptions={{
      duration: 5000,
      style: {
        background: '#fff',
        color: '#374151',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      },
      success: {
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff'
        }
      },
      error: {
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff'
        }
      }
    }}
  />
);

export default Toast; 