import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries';

const options = { next: { revalidate: 60 } };

export default async function HomeBanner() {
  const home = await client.fetch(HOME_PAGE_QUERY, {}, options);

  if (!home?.banner) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-100 px-5 text-sm text-gray-500 md:px-10">
        請至 Studio「首頁」上傳 Banner／封面圖
      </div>
    );
  }

  const alt = home.banner.alt || 'piliclam';

  return (
    <section className="relative w-full">
      <Image
        src={urlFor(home.banner).width(2400).height(1200).url()}
        alt={alt}
        width={2400}
        height={1200}
        className="h-[50vh] w-full object-cover md:h-[70vh]"
        priority
      />
    </section>
  );
}
