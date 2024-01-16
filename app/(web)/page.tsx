import HeroSection from '@/src/components/HeroSection/HeroSection';
import PageSearch from '@/src/components/PageSearch/PageSearch';
import Gallery from '@/src/components/Gallery/Gallery';
import NewsLetter from '@/src/components/NewsLetter/NewsLetter';
import FeaturedRoom from '@/src/components/FeaturedRoom/FeaturedRoom';
import { getFeaturedRoom } from '@/src/libs/apis';

const Home = async () => {
  const isFeaturedRoom = await getFeaturedRoom();

  return (
    <>
      <HeroSection />
      <PageSearch />
      <FeaturedRoom featuredRoom={isFeaturedRoom} />
      <Gallery />
      <NewsLetter />
    </>
  );
};

export default Home;