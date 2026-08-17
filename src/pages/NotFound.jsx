import { Link } from 'react-router-dom';
import Page from '@/components/layout/Page';
import { CATEGORIES, TOTALS } from '@/lib/catalog';
import Icon from '@/components/ui/Icon';
import { ActionButton } from '@/components/ui/primitives';
import { EmberField, Glow } from '@/components/ui/Atmosphere';

/**
 * A dud is a firework that didn't catch. It is also the right word for this
 * page, and the safety rule that goes with it is worth repeating anyway.
 */
export default function NotFound() {
  return (
    <Page
      bare
      title="Page not found | Veyila Crackers"
      description="That page doesn't exist. Head back to the price list."
    >
      <section className="relative grid min-h-[90svh] place-items-center overflow-hidden px-5 pt-32">
        <Glow className="left-1/2 top-1/3 -translate-x-1/2" color="rgba(226,59,38,.2)" size={640} />
        <EmberField density={18} />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-7 justify-center">Error 404</p>

          <h1 className="text-display text-paper">
            A dud.
          </h1>

          <p className="mx-auto mt-8 max-w-md text-pretty leading-relaxed text-paper/55">
            This page didn't catch. Nothing to relight — head back to the sheet, where all {TOTALS.products} lines are
            still waiting.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ActionButton to="/products" variant="ember">
              Open the price list
            </ActionButton>
            <ActionButton to="/" variant="ghost" icon="spark">
              Back to the front
            </ActionButton>
          </div>

          <div className="mt-14 border-t border-ink-600 pt-8">
            <p className="eyebrow mb-4 justify-center">Or pick a shelf</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.slice(0, 8).map((category) => (
                <Link key={category.id} to={`/categories/${category.id}`} className="chip">
                  {category.name}
                </Link>
              ))}
              <Link to="/categories" className="chip chip-on">
                All {CATEGORIES.length}
                <Icon name="arrow" size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
