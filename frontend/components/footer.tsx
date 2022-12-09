export const Footer = () => (
  <footer className='hidden absolute bottom-0 w-full p-2 shadow md:flex md:items-center md:justify-between bg-gray-900 z-10'>
    <span className='text-sm sm:text-center text-gray-400'>
      © 2022{' '}
      <a href='https://linkme.egeland.io' className='hover:underline'>
        Kodea Solutions™
      </a>
      . All Rights Reserved.
    </span>
    <ul className='flex flex-wrap items-center mt-3 text-sm text-gray-400 sm:mt-0'>
      <li>
        <a href='https://linkme.egeland.io/' className='hover:underline'>
          Contact
        </a>
      </li>
    </ul>
  </footer>
);
