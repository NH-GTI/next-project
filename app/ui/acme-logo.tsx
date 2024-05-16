import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-50 w-50 rotate-[15deg]" />
      <p className="pl-5 text-[30px]">Intranet</p>
    </div>
  );
}
