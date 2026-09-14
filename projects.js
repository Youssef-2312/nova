// ============================================
// NOVA — Project data (single source of truth)
//
// ADD NEW PROJECTS TO THE TOP OF THIS LIST.
//
// The newest 3 automatically appear in the
// homepage "Selected Work" preview and in the
// About page collage (newest on the left; the
// oldest of the three drops out of those views).
// The Portfolio page always shows every project,
// and its industry filters build themselves from
// whatever industries exist below.
//
// Fields:
//   id            unique slug (used internally)
//   title         display name
//   industry      filter key (kebab-case)
//   industryLabel filter/display label
//   tech          array of tag strings
//   url           live site link ("" if none)
//   external      true = opens in a new tab
//   img           screenshot path (img/*.jpg)
//   color         gradient fallback while image loads
//   blurb         one-liner shown on cards
//   desc          longer text shown in the modal
// ============================================

window.NOVA_PROJECTS = [
  { id: 'bent-aboha',
    title: 'Bent Aboha',
    industry: 'retail',
    industryLabel: 'Fashion Retail',
    tech: ['Shopify', 'Custom Theme'],
    url: 'https://cv0mwv-x1.myshopify.com',
    external: true,
    img: 'img/bentaboha.jpg',
    color: 'linear-gradient(150deg,#3b2f2f,#a8846b)',
    blurb: 'A heritage-inspired Shopify streetwear brand — totes, tees, caps and hats built around identity and pride.',
    desc: 'A Shopify store for Bent Aboha, a heritage-driven streetwear label — "Rooted in heritage, worn with pride." Four collections (tote bags, tees, caps and hats) presented through an editorial, story-led homepage with a clean checkout flow.'
},  { id: 'elane',
    title: 'Elane The Studio',
    industry: 'retail',
    industryLabel: 'Fashion Retail',
    tech: ['Shopify', 'Custom Theme'],
    url: 'https://elanethestudio.com',
    external: true,
    img: 'img/elane.jpg',
    color: 'linear-gradient(150deg,#5c614c,#a5a58d)',
    blurb: 'A minimalist Shopify boutique for a contemporary fashion brand, built around editorial photography.',
    desc: 'A minimalist Shopify boutique for a contemporary Egyptian fashion brand — editorial photography, a clean collection layout, and a streamlined cart built around elevated everyday pieces.'
  },
  {
    id: 'azelea',
    title: 'Azelea Co.',
    industry: 'retail',
    industryLabel: 'Fashion Retail',
    tech: ['Shopify', 'Custom Theme'],
    url: 'https://azelea.co',
    external: true,
    img: 'img/azelea.jpg',
    color: 'linear-gradient(150deg,#2e4159,#93a8bd)',
    blurb: 'A Shopify store for a tailored fashion label — denim, knitwear, and seasonal edits.',
    desc: 'A Shopify store for a tailored fashion label — denim, knitwear, and seasonal edits presented in a clean, easy-to-browse collection structure with free-shipping incentives built into the flow.'
  },
  {
    id: 'solace',
    title: 'Solace Clinics',
    industry: 'wellness',
    industryLabel: 'Wellness',
    tech: ['HTML', 'CSS', 'JavaScript'],
    url: 'demos/solace/',
    external: false,
    img: 'img/solace.jpg',
    color: 'linear-gradient(150deg,#eef1f7,#c7d1e3)',
    blurb: 'A calm, conversion-focused concept site for a multi-location wellness clinic — hand-coded by Nova.',
    desc: 'A calm, conversion-focused concept site for a multi-location wellness clinic — designed and hand-coded by Nova to show what a bespoke, fully custom build looks like. Explore the live demo.'
  }
];
