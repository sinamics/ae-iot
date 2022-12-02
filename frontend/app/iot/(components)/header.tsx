import React from 'react';

const Header = () => {
  return (
    <header className='pt-10'>
      <h1 className='flex justify-center  text-3xl sm:text-2xl lg:text-3xl '>
        IoT Dashboard
      </h1>
      <p className='flex justify-center text-gray-400 pb-5'>
        Clients will report every 5min
      </p>
    </header>
  );
};

export default Header;
