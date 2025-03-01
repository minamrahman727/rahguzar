import Link from 'next/link';

export default function Footer() {
    return (
      <footer className="bg-blue-900 text-white p-4 text-center mt-6">
        <p>Information provided by <Link href="https://cheeltech.com/" className="underline">CheelTech</Link></p>
        <p>Developed by <Link href="https://smrehman.vercel.app/" className="underline">Syed Minam Ur Rehman</Link></p>
        <p>&copy; 2025 ZEX software solutions. All rights reserved.</p>
      </footer>
    );
  }
  