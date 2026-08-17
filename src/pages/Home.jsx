import Page from '@/components/layout/Page';
import Hero from '@/components/home/Hero';
import {
  AssuranceStrip,
  CategoryRail,
  ComboShowcase,
  EditorialFeature,
  PopularPicks,
  ShopStory,
} from '@/components/home/Sections';
import { ClosingCta, SafetySection, SheetPreview, Testimonials } from '@/components/home/Sections2';
import { TOTALS } from '@/lib/catalog';

/**
 * Homepage running order:
 *   hero → why us → shelves → popular picks → one line told properly
 *   → the sheet itself → boxes → the shop → safety → voices → close
 *
 * Popular picks now follows the category shelf directly, so a browsing
 * customer sees what's selling before the page slows down for the editorial
 * feature and the sheet.
 */
export default function Home() {
  return (
    <Page
      bare
      title="Veyila Crackers — Diwali fireworks direct from Sivakasi"
      description={`${TOTALS.products} lines of Sivakasi-made crackers at 80% off the printed list. Fill in the estimate sheet and send your order on WhatsApp. Virudhunagar counter, since 1998.`}
      canonical="/"
    >
      <Hero />
      <AssuranceStrip />
      <CategoryRail />
      <PopularPicks />
      <ComboShowcase />
      <SheetPreview />
      <ShopStory />
      <SafetySection />
      <Testimonials />
      <ClosingCta />
    </Page>
  );
}