import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Api/Settings/ProfileController';
import DeleteUser from '@/components/auth/delete-user';
import Heading from '@/components/app/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <div className="flex max-w-2xl flex-col gap-8 p-6 lg:p-12">
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-indigo-600"></span>
                    <span className="text-xs font-black tracking-widest text-indigo-600 uppercase">
                        Account Settings
                    </span>
                </div>

                <Heading
                    title="Profile"
                    description="Update your personal information and email address."
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                    >
                                        Name
                                    </Label>

                                    <Input
                                        id="name"
                                        className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-black tracking-widest text-gray-400 uppercase"
                                    >
                                        Email address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-12 rounded-xl border-none bg-gray-50 px-4 text-sm font-bold shadow-sm ring-1 ring-gray-100 transition-all focus:ring-2 focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    className="h-12 rounded-xl bg-indigo-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
                                    data-test="update-profile-button"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="mt-12 border-t border-gray-100 pt-12 dark:border-white/5">
                    <DeleteUser />
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
