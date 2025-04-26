'use client';
import { motion } from 'framer-motion';
import { Button } from './page';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <motion.div
      className="relative z-10 text-center bg-gray-800/50 backdrop-blur-sm p-8 px-4 md:p-12 rounded-xl shadow-lg border border-gray-700/50 max-w-2xl w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>

      <Button onClick={() => router.replace('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg cursor-pointer mx-auto">
        ← Back to Home
      </Button>
    </motion.div>
  );
}
