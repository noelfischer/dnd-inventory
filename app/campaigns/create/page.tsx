import { createCampaign } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {
  BookOpenIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns' },
          {
            label: 'Create Campaign',
            href: '/campaigns/create',
            active: true,
          },
        ]}
      />
      <form action={createCampaign}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Campaign name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Choose a campaign name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  maxLength={100}
                  type="text"
                  placeholder="Enter campaign name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Campaign description */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Choose a campaign description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  maxLength={300}
                  placeholder="Enter a description"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BookOpenIcon className="pointer-events-none absolute left-3 top-1/4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <Button type="submit">Create Campaign</Button>
        </div>
      </form>
    </main>
  );
}