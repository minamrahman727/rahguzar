import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-cyan-600 via-blue-800 to-indigo-900 text-white p-6 text-center mt-6">
      <div className="mb-4 flex justify-center space-x-4">
        <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebook className="text-3xl  transition duration-300" />
        </Link>
        <Link href="https://instagram.com/syedminamurrehman" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram className="text-3xl  transition duration-300" />
        </Link>
        <Link href="https://linkedin.com/in/syedminamurrehman" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="text-3xl  transition duration-300" />
        </Link>
        <Link href="https://github.com/minamrahman727/rahguzar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub className="text-3xl   transition duration-300" />
        </Link>
         <Link href="mailto:minamrahman727@gmail.com?subject=Inquiry%20about%20Rahguzar" target="_blank" rel="noopener noreferrer" aria-label="Email">
          <FaEnvelope className="text-3xl  transition duration-300" />
        </Link>
      </div>
      {/* <p className='font-serif text-base'>Developed by Syed Minam Ur Rehman</p> */}
      <p className=' text-xs'>Information provided by <Link href="https://cheeltech.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-200 transition duration-300">Cheeltech</Link></p>
      <p className='text-sm '>&copy; {currentYear} Syed Minam Ur Rehman. All rights reserved.</p>
    </footer>
  );
}
