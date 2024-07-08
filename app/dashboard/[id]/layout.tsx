import '@/app/ui/global.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='mt-7 ml-7 mr-7'>{children}</main>
  );
}