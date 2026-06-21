import AppLogoIcon from '@/components/app/app-logo-icon';
import { dashboard, login, register } from '@/routes';
import { Head, Link, usePage } from '@inertiajs/react';
import { Facebook, Github, Instagram, Mail, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Welcome() {
    const { auth } = usePage().props;

    const calculateTimeLeft = () => {
        // Target date: July 7, 2026
        const targetDate = new Date('2026-07-07T00:00:00');
        const difference = +targetDate - +new Date();
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Coming Soon" />
            <div className="flex min-h-screen flex-col bg-white text-[#333333] transition-colors duration-500 dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header with Auth Links */}
                <header className="absolute top-0 z-50 flex w-full items-center justify-between p-6 lg:px-12">
                    <div className="flex items-center gap-3">
                        <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <AppLogoIcon className="size-6" />
                        </div>
                        <span className="text-xl font-black tracking-tight uppercase">
                            Helpdesk
                        </span>
                    </div>

                    <nav className="flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    href={login()}
                                    className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="hidden rounded-full border border-gray-200 px-6 py-2.5 text-sm font-bold transition-all hover:border-indigo-600 hover:text-indigo-600 sm:block dark:border-white/20 dark:hover:border-white dark:hover:text-white"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </nav>
                </header>

                <main className="flex flex-1 flex-col lg:flex-row">
                    {/* Left Side: Content */}
                    <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-32 pb-20 lg:px-24 lg:pt-0 lg:pb-0">
                        <div className="max-w-2xl">
                            <div className="mb-6 flex items-center gap-2">
                                <span className="h-px w-8 bg-indigo-600"></span>
                                <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                                    We are launching soon
                                </span>
                            </div>

                            <h1 className="mb-6 text-5xl font-black tracking-tight lg:text-8xl">
                                iOSoon <br />
                                <span className="text-indigo-600 italic">
                                    Experience.
                                </span>
                            </h1>

                            <p className="mb-10 text-lg leading-relaxed text-gray-500 lg:text-xl dark:text-gray-400">
                                Our revolutionary helpdesk platform is almost
                                ready. We're crafting a seamless experience for
                                your support team. Stay tuned!
                            </p>

                            {/* Countdown Timer */}
                            <div className="mb-12 flex flex-wrap gap-4 lg:gap-8">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    {
                                        label: 'Minutes',
                                        value: timeLeft.minutes,
                                    },
                                    {
                                        label: 'Seconds',
                                        value: timeLeft.seconds,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="flex aspect-square size-20 items-center justify-center rounded-3xl bg-gray-50 text-3xl font-black lg:size-28 lg:text-5xl dark:bg-white/5">
                                            {String(item.value).padStart(
                                                2,
                                                '0',
                                            )}
                                        </div>
                                        <span className="mt-3 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Subscription Form */}
                            <div className="mb-12">
                                <form
                                    className="relative flex w-full max-w-md items-center"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <div className="absolute left-5 text-gray-400">
                                        <Mail className="size-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-16 w-full rounded-2xl border-none bg-gray-50 pr-40 pl-14 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-700 active:scale-95"
                                    >
                                        Notify Me
                                    </button>
                                </form>
                                <p className="mt-4 text-xs font-medium text-gray-400">
                                    We'll notify you when we launch. No spam, we
                                    promise.
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-8">
                                {[Twitter, Github, Facebook, Instagram].map(
                                    (Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="group text-gray-400 transition-all hover:-translate-y-1 hover:text-indigo-600 dark:hover:text-white"
                                        >
                                            <Icon className="size-5" />
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Illustration & Decor */}
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
                                        Your New Support Hub.
                                    </h2>
                                    <p className="text-indigo-100">
                                        Managing tickets has never been this
                                        smooth. Coming soon to all your devices.
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
                                        Status
                                    </p>
                                    <p className="text-sm font-bold">
                                        Systems Online
                                    </p>
                                </div>
                            </div>

                            {/* Floating Badge 2 */}
                            <div className="absolute bottom-32 -left-16 flex animate-pulse items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800">
                                <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase">
                                        New Tickets
                                    </p>
                                    <p className="text-sm font-bold">
                                        +12 Incoming
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
