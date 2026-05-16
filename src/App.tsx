import { Routes, Route, Navigate } from 'react-router-dom';
import { PasswordGate } from '@/components/PasswordGate';
import { Workspace } from '@/pages/Workspace';

export default function App() {
  return (
    <PasswordGate>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PasswordGate>
  );
}
