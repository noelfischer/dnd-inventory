import ToggleDarkMode from "../../ui/darkmode-toggle";

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <main className='mt-7 ml-7 mr-7'>
      <ToggleDarkMode />
      {children}</main>
  );
}
