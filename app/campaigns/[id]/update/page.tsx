import { createCampaign, updateCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {
  BookOpenIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  //TODO replace user with actual user ID
  const uID = "1DFWeGwWse";

  const campaignID = params.id;

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }

  const updateCampaignWithId = updateCampaign.bind(null, campaignID);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns' },
          {
            label: 'Update Campaign',
            href: '/campaigns/update',
            active: true,
          },
        ]}
      />
      <form action={updateCampaignWithId}>
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
                  placeholder={campaign.name}
                  defaultValue={campaign.name}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                  placeholder={campaign.description}
                  defaultValue={campaign.description}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BookOpenIcon className="pointer-events-none absolute left-3 top-1/4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <Button type="submit">Update Campaign</Button>
        </div>
      </form>
    </main>
  );
}