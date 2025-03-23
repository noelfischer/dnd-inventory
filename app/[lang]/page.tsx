import { LinkButton } from '@/components/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ToggleDarkMode from '../ui/darkmode-toggle';
import { auth } from '@/lib/auth';
import { getDictFromParams, Locale } from './dictionaries';
import WelcomeBack from './hero/WelcomeBack';
import LandingPage from './hero/LandingPage';
import { fetchUserAndCharacterCount } from '@/lib/data';

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const dict = await getDictFromParams(params)

  const data = await auth();
  const isNotAuthenticated = !data;
  let {userCount, characterCount} = await fetchUserAndCharacterCount();
  if(!userCount || !characterCount) {
    userCount = 724;
    characterCount = 1234;
  }

  if (isNotAuthenticated) {
    return <LandingPage totalUsers={userCount} totalCharacters={characterCount}/>;
  }
  else {
    return <WelcomeBack />;
  }

  return (
    <main className="flex min-h-screen flex-col max-h-screen overflow-y-hidden">
      <ToggleDarkMode singleBackground />
      <div className="flex h-[76px] bg-main" />
      <div className="flex grow flex-col md:flex-row h-full">
        <div className="flex flex-col justify-center gap-6 md:min-w-96 px-12 pt-10 pb-16 md:pb-32 md:w-2/5 md:px-20 md:bg-bg md:dark:bg-dark-elevated-bg">
          <p className={`text-xl md:text-3xl md:leading-normal`}>
            <strong>{dict.landingPage.title}</strong>. {dict.landingPage.description}
          </p>
          {isNotAuthenticated ?
            <><Link
              href="/login"
              className="unset"
            >
              <LinkButton>
                <span>{dict.landingPage.login}</span> <ArrowRight className="w-5 md:w-6" />
              </LinkButton>
            </Link>

              <div className="flex items-center w-full px-8" style={{ marginTop: "-3px", marginBottom: "-5px" }}>
                <div className="grow border-[1.5px] border-black dark:border-white"></div>
                <span className="mx-4 text-lg font-semibold">or</span>
                <div className="grow border-[1.5px] border-black dark:border-white"></div>
              </div>

              <Link
                href="/signup"
                className="unset"
              >
                <LinkButton>
                  <span>{dict.general.createAccount}</span> <ArrowRight className="w-5 md:w-6" />
                </LinkButton>
              </Link>
            </> :
            <Link
              href="/campaigns"
              className="unset mt-4"
            >
              <LinkButton>
                <span>{dict.landingPage.goToCampaigns}</span> <ArrowRight className="w-5 md:w-6" />
              </LinkButton>
            </Link>}
        </div>
        <div className="flex items-center justify-center w-full max-h-full">
          {/*<Image src="/landingBackground.jpg" width={1400} height={500} alt="Hero Image" className="landing-page-image inset-0 object-cover"/>*/}
        </div>
      </div>
    </main>
  );
}
