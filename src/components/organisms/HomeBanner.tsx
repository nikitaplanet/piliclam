import SanityImage from '@/components/atoms/SanityImage';
import { client } from '@/sanity/lib/client';
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
      <SanityImage
        value={home.banner}
        alt={alt}
        width={2400}
        height={1200}
        fill
        priority
        className="h-[50vh] w-full md:h-[70vh]"
        sizes="100vw"
      />
    </section>
  );
}
