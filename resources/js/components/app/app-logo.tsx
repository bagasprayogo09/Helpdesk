import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <AppLogoIcon className="size-6" />
            </div>
            <div className="ml-3 grid flex-1 text-left text-sm">
                <span className="truncate text-lg leading-tight font-black tracking-tight uppercase">
                    {name}
                </span>
            </div>
        </>
    );
}
