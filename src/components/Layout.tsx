import React from 'react'

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-gray-900 to-gray-600">
      <div className="w-auto h-auto p-4 mx-4 bg-white shadow-2xl md:w-160 md:p-12 rounded-xl">
        {children}
      </div>
    </div>
  )
}

export default Layout
