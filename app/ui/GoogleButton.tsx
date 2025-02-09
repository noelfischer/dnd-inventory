import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Or = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center w-full mt-6 mb-4", className)}>
            <div className="grow border-[0.5px] border-black/10"></div>
            <span className="mx-4 text-text/60">or</span>
            <div className="grow border-[0.5px] border-black/10"></div>
        </div>
    )
}

const GoogleButton = ({ className }: { className?: string }) => {
    return (
        <button
            type='submit'
            className={cn("flex items-center justify-center gap-5 px-6 py-2 bg-white border border-black rounded-md shadow-sm hover:bg-gray-200 hover:dark:bg-dark-bg/90 dark:bg-dark-bg dark:border-gray-700 text-sm text-black/80 dark:text-white/80 cursor-pointer w-full transition-all", className)}
        >
            <Image alt='google logo' src="./google.svg" width={20} height={20} />
            <span>Continue with Google</span>
        </button>

    )
}

export default GoogleButton;