import { ProtectedRoute } from '@/components/protected-route';

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
