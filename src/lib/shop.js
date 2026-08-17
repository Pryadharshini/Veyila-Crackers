/**
 * Every piece of shop-specific information the UI needs, in one place.
 * Nothing here is duplicated in a component.
 */
export const SHOP = {
  name: 'Veyila Crackers',
  nameTa: 'வெயிலா கிராக்கர்ஸ்',
  tagline: 'Light up happiness',
  taglineTa: 'மகிழ்ச்சியை ஏற்றுங்கள்',
  since: 1998,
  address: {
    line1: 'Sivakasi Main Road',
    line2: 'Near Raghavendra Temple',
    city: 'Virudhunagar',
    state: 'Tamil Nadu',
    pin: '626001',
    country: 'India',
  },
  phone: '9790379790',
  phoneDisplay: '+91 97903 79790',
  whatsapp: '919790379790',
  email: 'orders@veyilacrackers.com',
  hours: [
    ['Monday – Saturday', '9:00 am – 9:00 pm'],
    ['Sunday', '9:00 am – 2:00 pm'],
    ['Diwali week', 'Open till 11:00 pm'],
  ],
  /* Instagram is not live yet — the footer reads this and skips it. */
  social: {
    instagram: null,
    facebook: null,
    youtube: null,
  },
  minOrder: 2500,
};

export const addressLines = [
  SHOP.address.line1,
  SHOP.address.line2,
  `${SHOP.address.city} – ${SHOP.address.pin}`,
  SHOP.address.state,
];

export const addressOneLine = addressLines.join(', ');

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SHOP.name}, ${addressOneLine}`,
)}`;

export const telUrl = `tel:+91${SHOP.phone}`;
