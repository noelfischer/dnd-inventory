import Button from '@/components/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col max-h-screen overflow-y-hidden">
      <div className="flex h-[76px] bg-main" />
      <div className="flex grow flex-col md:flex-row h-full">
        <div className="flex flex-col justify-center gap-6 md:min-w-96 px-12 pt-10 pb-16 md:pb-32 md:w-2/5 md:px-20">
          <p className={`text-xl md:text-3xl md:leading-normal`}>
            <strong>D&D Inventory</strong>. Keep track of everything.
          </p>
          <Link
            href="/login"
            className="unset"
          >
            <Button>
              <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Button>
          </Link>

          <div className="flex items-center w-full px-8" style={{ marginTop: "-3px", marginBottom: "-5px" }}>
            <div className="flex-grow border-[1.5px] border-black dark:border-white"></div>
            <span className="mx-4 text-lg font-semibold">or</span>
            <div className="flex-grow border-[1.5px] border-black dark:border-white"></div>
          </div>

          <Link
            href="/signup"
            className="unset"
          >
            <Button>
              <span>Sign up</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center w-full max-h-full">
          {/*<Image src="/landingBackground.jpg" width={1400} height={500} alt="Hero Image" className="landing-page-image inset-0 object-cover"/>*/}
        </div>
      </div>
    </main>
  );
}
