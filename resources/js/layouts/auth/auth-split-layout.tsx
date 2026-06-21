import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Mail } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-white text-[#333333] transition-colors duration-500 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
            {/* Header / Logo */}
            <header className="absolute top-0 z-50 flex w-full items-center justify-between p-6 lg:px-12">
                <Link href={home()} className="flex items-center gap-3">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                        <AppLogoIcon className="size-6" />
                    </div>
                    <span className="text-xl font-black tracking-tight uppercase">
                        {name}
                    </span>
                </Link>
            </header>

            <main className="flex flex-1 flex-col lg:flex-row">
                {/* Left Side: Auth Content */}
                <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-32 pb-20 lg:px-24 lg:pt-0 lg:pb-0">
                    <div className="mx-auto w-full max-w-md lg:mx-0">
                        <div className="mb-6 flex items-center gap-2">
                            <span className="h-px w-8 bg-indigo-600"></span>
                            <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                                Authentication
                            </span>
                        </div>

                        <h1 className="mb-4 text-4xl font-black tracking-tight lg:text-5xl">
                            {title}
                        </h1>

                        <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
                            {description}
                        </p>

                        <div className="mt-8">{children}</div>
                    </div>
                </div>

                {/* Right Side: Illustration & Decor (Consistent with Welcome) */}
                <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-indigo-50 lg:flex dark:bg-[#111111]">
                    {/* Background Decor */}
                    <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-200/50 blur-[120px] dark:bg-indigo-900/20"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-200/50 blur-[120px] dark:bg-blue-900/20"></div>

                    {/* Floating Cards / Elements */}
                    <div className="relative z-10 scale-110">
                        {/* Main Illustration Device */}
                        <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[3rem] border-8 border-white bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                            <div className="h-full w-full bg-indigo-600 p-8 pt-20 text-white">
                                <div className="mb-8 flex aspect-square size-16 items-center justify-center rounded-2xl bg-white/20">
                                    <AppLogoIcon className="size-10" />
                                </div>
                                <h2 className="mb-4 text-3xl leading-tight font-black">
                                    Secure & Seamless.
                                </h2>
                                <p className="text-indigo-100">
                                    Access your support dashboard with ease.
                                    Your tickets are waiting for you.
                                </p>

                                <div className="mt-12 space-y-4">
                                    <div className="h-12 w-full rounded-xl bg-white/10"></div>
                                    <div className="h-12 w-full rounded-xl bg-white/10"></div>
                                    <div className="h-12 w-3/4 rounded-xl bg-white/10"></div>
                                </div>
                            </div>
                            {/* Device Camera Notch */}
                            <div className="absolute top-0 left-1/2 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-white dark:bg-gray-800"></div>
                        </div>

                        {/* Floating Badge 1 */}
                        <div className="absolute top-20 -right-12 flex animate-bounce items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800">
                            <div className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="size-5"
                                >
                                    <path
                                        d="M20 6L9 17L4 12"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase">
                                    Security
                                </p>
                                <p className="text-sm font-bold">Encrypted</p>
                            </div>
                        </div>

                        {/* Floating Badge 2 */}
                        <div className="absolute bottom-32 -left-16 flex animate-pulse items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800">
                            <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <Mail className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase">
                                    Support
                                </p>
                                <p className="text-sm font-bold">
                                    Ready to help
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
