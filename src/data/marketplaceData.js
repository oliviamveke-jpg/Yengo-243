// Helper to generate default monetization fields
function vendorDefaults() {
  return {
    subscription: { plan: 'free', expiresAt: null, subscribedAt: null },
    boostPin: { active: false, expiresAt: null, boostedAt: null, days: 0 },
    delivery: { enabled: false, feeFC: 0, commissionRate: 0.10 }
  }
}

export const vendors = [
  {
    id: "v-gombe-tech",
    ownerId: "vendor-1",
    name: "Gombe Tech Market",
    province: "Kinshasa",
    commune: "Gombe",
    ville: "Kinshasa Ville",
    quartier: "Quartier Industriel",
    coords: [-4.319, 15.316],
    rating: 4.7,
    category: "Électronique",
    description: "Smartphones, accessoires et solutions électroniques pour la vie quotidienne.",
    profileImage: null,
    ...vendorDefaults(),
    products: [
      {
        id: "v-gombe-tech-phone-a15",
        title: "Smartphone A15",
        image: null,
        category: "Électronique",
        subcategory: "Téléphones",
        price: 185,
        currency: "USD",
        description: "Smartphone double SIM avec 128 Go, garanti 6 mois."
      },
      {
        id: "v-gombe-tech-powerbank-20k",
        title: "Powerbank 20000 mAh",
        image: null,
        category: "Électronique",
        subcategory: "Accessoires",
        price: 28,
        currency: "USD",
        description: "Batterie externe USB-C pour longues journées en ville."
      },
      {
        id: "v-gombe-tech-buds-mini",
        title: "Écouteurs Bluetooth Mini",
        image: null,
        category: "Électronique",
        subcategory: "Audio",
        price: 22,
        currency: "USD",
        description: "Écouteurs sans fil avec boîtier de charge compact."
      }
    ]
  },
  {
    id: "v-gombe-style",
    ownerId: null,
    name: "Avenue Mode Gombe",
    province: "Kinshasa",
    commune: "Gombe",
    ville: "Kinshasa Ville",
    quartier: "Les Avocats",
    coords: [-4.322, 15.317],
    rating: 4.5,
    category: "Vêtements",
    description: "Collection moderne et confortable pour homme et femme.",
    profileImage: null,
    ...vendorDefaults(),
    products: [
      {
        id: "v-gombe-style-shirt-linen",
        title: "Chemise légère",
        image: null,
        category: "Vêtements",
        subcategory: "Homme",
        price: 24,
        currency: "USD",
        description: "Chemise respirante pour bureau et sorties."
      },
      {
        id: "v-gombe-style-dress-city",
        title: "Robe urbaine",
        image: null,
        category: "Vêtements",
        subcategory: "Femme",
        price: 38,
        currency: "USD",
        description: "Robe ajustée avec tissu confortable."
      },
      {
        id: "v-gombe-style-sneakers-white",
        title: "Baskets blanches",
        image: null,
        category: "Vêtements",
        subcategory: "Chaussures",
        price: 45,
        currency: "USD",
        description: "Baskets polyvalentes pour marche quotidienne."
      }
    ]
  },
  {
    id: "v-kintambo-fresh",
    ownerId: null,
    name: "Kintambo Fresh",
    province: "Kinshasa",
    commune: "Kintambo",
    ville: "Kinshasa Ville",
    quartier: "Kintambo Magasin",
    coords: [-4.309, 15.301],
    rating: 4.6,
    category: "Alimentation",
    description: "Produits alimentaires frais et épicerie locale en livraison rapide.",
    profileImage: null,
    ...vendorDefaults(),
    products: [
      {
        id: "v-kintambo-fresh-rice-5kg",
        title: "Riz parfumé 5 kg",
        image: null,
        category: "Alimentation",
        subcategory: "Épicerie",
        price: 12,
        currency: "USD",
        description: "Sac de riz familial pour livraison locale."
      },
      {
        id: "v-kintambo-fresh-oil-5l",
        title: "Huile végétale 5 L",
        image: null,
        category: "Alimentation",
        subcategory: "Épicerie",
        price: 14,
        currency: "USD",
        description: "Huile de cuisine conditionnée en bidon."
      },
      {
        id: "v-kintambo-fresh-coffee-kivu",
        title: "Café moulu Kivu",
        image: null,
        category: "Alimentation",
        subcategory: "Boissons",
        price: 9,
        currency: "USD",
        description: "Café moulu aromatique en paquet de 250 g."
      }
    ]
  },
  {
    id: "v-lemba-home",
    ownerId: null,
    name: "Maison Lemba",
    province: "Kinshasa",
    commune: "Lemba",
    ville: "Kinshasa Ville",
    quartier: "Quartier Socimat",
    coords: [-4.331, 15.351],
    rating: 4.4,
    category: "Maison",
    description: "Solutions pour la maison: éclairage, literie et électroménager.",
    profileImage: null,
    ...vendorDefaults(),
    products: [
      {
        id: "v-lemba-home-led-lamp",
        title: "Lampe LED bureau",
        image: null,
        category: "Maison",
        subcategory: "Éclairage",
        price: 18,
        currency: "USD",
        description: "Lampe compacte avec lumière blanche réglable."
      },
      {
        id: "v-lemba-home-fan-stand",
        title: "Ventilateur sur pied",
        image: null,
        category: "Maison",
        subcategory: "Électroménager",
        price: 42,
        currency: "USD",
        description: "Ventilateur oscillant avec trois vitesses."
      },
      {
        id: "v-lemba-home-pillow-set",
        title: "Lot de 2 oreillers",
        image: null,
        category: "Maison",
        subcategory: "Literie",
        price: 20,
        currency: "USD",
        description: "Oreillers doux pour chambre ou salon."
      }
    ]
  },
  {
    id: "v-kalamu-beauty",
    ownerId: null,
    name: "Kalamu Beauty Corner",
    province: "Kinshasa",
    commune: "Kalamu",
    ville: "Kinshasa Ville",
    quartier: "Ngiri-Ngiri",
    coords: [-4.3338, 15.2996],
    rating: 4.8,
    category: "Beauté",
    description: "Soins et parfums locaux pour beauté du visage et cheveux.",
    profileImage: null,
    ...vendorDefaults(),
    products: [
      {
        id: "v-kalamu-beauty-cream-day",
        title: "Crème visage jour",
        image: null,
        category: "Beauté",
        subcategory: "Soins visage",
        price: 16,
        currency: "USD",
        description: "Crème hydratante adaptée au climat chaud."
      },
      {
        id: "v-kalamu-beauty-shampoo-shea",
        title: "Shampoing karité",
        image: null,
        category: "Beauté",
        subcategory: "Cheveux",
        price: 11,
        currency: "USD",
        description: "Shampoing nourrissant pour cheveux naturels."
      },
      {
        id: "v-kalamu-beauty-perfume-mini",
        title: "Parfum format sac",
        image: null,
        category: "Beauté",
        subcategory: "Parfums",
        price: 13,
        currency: "USD",
        description: "Petit format pratique pour déplacement."
      }
    ]
  },
  {
    id: "v-limete-tools",
    ownerId: null,
    name: "Limete Pro Tools",
    province: "Kinshasa",
    commune: "Limete",
    ville: "Kinshasa Ville",
    quartier: "Limete-Centre",
    coords: [-4.3313, 15.368],
    rating: 4.3,
    category: "Outillage",
    description: "Outils robustes pour bricolage et petites réparations.",
    profileImage: null,
    ...vendorDefaults(),
    products: [
      {
        id: "v-limete-tools-drill-basic",
        title: "Perceuse 500 W",
        image: null,
        category: "Outillage",
        subcategory: "Électroportatif",
        price: 58,
        currency: "USD",
        description: "Perceuse filaire pour petits travaux."
      },
      {
        id: "v-limete-tools-toolkit-home",
        title: "Kit tournevis maison",
        image: null,
        category: "Outillage",
        subcategory: "Main",
        price: 17,
        currency: "USD",
        description: "Set de tournevis plats et cruciformes."
      },
      {
        id: "v-limete-tools-wrench-set",
        title: "Jeu de clés",
        image: null,
        category: "Outillage",
        subcategory: "Main",
        price: 25,
        currency: "USD",
        description: "Clés mixtes pour réparations courantes."
      }
    ]
  }
];

export const seedReviews = [
  { id: "rev-seed-1", vendorId: "v-gombe-tech", name: "Merveille", stars: 5, comment: "Livraison rapide et téléphone conforme.", createdAt: "2026-05-18T08:30:00.000Z" },
  { id: "rev-seed-2", vendorId: "v-gombe-tech", name: "Patrick", stars: 4, comment: "Bon service, accessoires bien emballés.", createdAt: "2026-05-23T11:10:00.000Z" },
  { id: "rev-seed-3", vendorId: "v-kintambo-fresh", name: "Sarah", stars: 5, comment: "Produits frais et prix clair.", createdAt: "2026-05-20T14:20:00.000Z" },
  { id: "rev-seed-4", vendorId: "v-lemba-home", name: "Joel", stars: 4, comment: "Le ventilateur fonctionne bien.", createdAt: "2026-05-25T09:45:00.000Z" },
  { id: "rev-seed-5", vendorId: "v-kalamu-beauty", name: "Amina", stars: 5, comment: "Très bons conseils pour les soins cheveux.", createdAt: "2026-05-28T16:05:00.000Z" },
  { id: "rev-seed-6", vendorId: "v-limete-tools", name: "Cedrick", stars: 4, comment: "Kit solide pour les petites réparations.", createdAt: "2026-06-01T10:15:00.000Z" }
];

export const sampleUsers = [
  { id: "buyer-1", role: "buyer", fullName: "Client Yengo", label: "Client" },
  { id: "vendor-1", role: "vendor", fullName: "Joseph Gombe", label: "Propriétaire Gombe Tech" }
];
