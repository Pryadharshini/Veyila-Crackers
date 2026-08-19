import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';

/**
 * Breadcrumbs. Also emits BreadcrumbList structured data, since deep product
 * pages are the ones that get found in search.
 */
export default function Breadcrumbs({ trail = [], className = '' }) {
  const items = [{ to: '/', label: 'Home' }, ...trail];

  return (
    <>
      <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-2xs ${className}`}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {last || !item.to ? (
                <span className="font-mono uppercase tracking-[0.16em] text-[#32080B]/40">{item.label}</span>
              ) : (
                <Link
                  to={item.to}
                  className="font-mono uppercase tracking-[0.16em] text-[#32080B]/55 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              )}
              {!last && <Icon name="chevron" size={11} className="text-[#32080B]/20" />}
            </span>
          );
        })}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.label,
              item: item.to ? `https://veyilacrackers.com${item.to}` : undefined,
            })),
          }),
        }}
      />
    </>
  );
}
