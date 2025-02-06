const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* The navbar is rendered in App.js */}
      <main className="flex-grow mt-24">  {/* Add margin-top here */}
        {children}
      </main>
    </div>
  );
};

export default Layout; 