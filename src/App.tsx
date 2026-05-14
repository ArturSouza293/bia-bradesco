import { Routes, Route, Navigate } from 'react-router-dom';
import { PhoneFrame } from '@/components/phone/PhoneFrame';
import { Landing } from '@/pages/Landing';
import { Chat } from '@/pages/Chat';
import { Dashboard } from '@/pages/Dashboard';

export default function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  );
}
