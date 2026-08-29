function deepMerge(base, override) {
  if (override == null) return base;
  if (!base || typeof base !== "object" || Array.isArray(base)) return override ?? base;
  if (!override || typeof override !== "object" || Array.isArray(override)) return override ?? base;
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (key in merged && typeof merged[key] === "object" && !Array.isArray(merged[key]) && typeof value === "object" && !Array.isArray(value)) {
      merged[key] = deepMerge(merged[key], value);
    } else if (key in merged && Array.isArray(merged[key]) && Array.isArray(value)) {
      merged[key] = value.length > 0 ? value : merged[key];
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

export const SHOWCASE_SPEED_OPTIONS = [
  0.5, 0.7, 0.85, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5,
];

export function snapShowcaseSpeed(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 1;
  let best = SHOWCASE_SPEED_OPTIONS[SHOWCASE_SPEED_OPTIONS.length - 1];
  let bestDiff = Math.abs(best - n);
  for (const option of SHOWCASE_SPEED_OPTIONS) {
    const diff = Math.abs(option - n);
    if (diff < bestDiff) {
      best = option;
      bestDiff = diff;
    }
  }
  return best;
}

export const HOME_PAGE_DEFAULTS = {
  hero: {
    pill_text: "Built exclusively for jewelry brands",
    title_html: "Your jewelry.<br /><em>Studio-quality visuals.</em><br />No photographer needed.",
    title: "Your jewelry. Studio-quality visuals. No photographer needed.",
    subtitle:
      "Upload a reference photo — or nothing at all. Splash understands jewelry and generates product shots, model imagery, and campaign visuals in minutes.",
    cta_primary_text: "Get a demo",
    cta_primary_href: "https://calendly.com/mousumi-gosplash/30min",
    cta_secondary_text: "Start creating for free",
    cta_secondary_href: "/signup",
    note: "No credit card required · No prompts needed · First images on us",
    bottom_text:
      "Upload a reference photo — or nothing at all. Splash understands jewelry and generates product shots, model imagery, and campaign visuals in minutes.",
  },
  ticker: [
    { strong: "Save up to 80%", span: "on photography costs" },
    { strong: "No prompts needed", span: "upload & generate" },
    { strong: "Understands jewelry", span: "metals, gems & styling" },
    { strong: "India-first", span: "built for the Indian jewelry market" },
  ],
  showcase: {
    eye_label: "Showcase",
    title_html: "Created<br />with Splash",
    heading: "Created with Splash",
    subheading: "Campaign-ready visuals created entirely with Splash AI Studio.",
    cta_text: "View all →",
    cta_href: "/gallery",
    marquee_seconds: 1,
  },
  how: {
    eye_label: "How it works",
    title_html: "Three steps to<br /><em>studio-perfect visuals</em>",
    steps: [
      {
        number: "01",
        title: "Upload your jewelry piece",
        description:
          "Take a simple photo with your phone or use an existing product image. Or skip it entirely — Splash can generate beautiful visuals from scratch. It works brilliantly either way.",
      },
      {
        number: "02",
        title: "AI composes the scene",
        description:
          "Splash reads your jewelry's metal finish, gemstone type, and style — then generates a campaign-ready visual with the perfect lighting, backdrop, and composition. Share a reference image to match any mood.",
      },
      {
        number: "03",
        title: "Download & publish",
        description:
          "Export in full resolution. Use it on your website, social media, ads, catalogues, or share directly with your team for review — all from one place.",
      },
    ],
    visual: {
      label: "One upload",
      title_html: "Multiple campaign-ready<br />outputs in seconds",
    },
  },
  output: {
    eye_label: "What you can create",
    title_html: "Every visual<br /><em>your brand needs</em>",
    items: [
      { title: "Clean product shot", description: "White or plain background. Perfect for websites, marketplaces, and catalogs." },
      { title: "Campaign visual", description: "Editorial, mood-driven imagery for ads, lookbooks, and seasonal campaigns." },
      { title: "Lifestyle setup", description: "Themed scenes with props, textures, and environments that match your brand." },
      { title: "Model shot", description: "Jewelry worn on a model — up to 5 pieces styled together in a single image." },
      { title: "Bulk catalog", description: "Generate dozens of consistent images across your full collection in one session." },
    ],
  },
  capabilities: {
    eye_label: "Capabilities",
    title_html: "Built different.<br /><em>For jewelry.</em>",
    items: [
      {
        tag: "No prompt required",
        title: "Generate without typing a single word",
        description:
          "Most AI tools require technical descriptions. Splash understands jewelry — metals, gemstones, silhouettes — and composes the perfect scene automatically. Just upload and go.",
        pills: ["White background", "Themed setups", "Auto-composed"],
        highlighted: true,
      },
      {
        tag: "Mood matching",
        title: "Share a reference. Get that exact feel.",
        description:
          "Upload any inspiration image — a campaign you love, a competitor's shoot, a mood board. Splash reads the lighting, backdrop, colour palette, and styling, then applies it to your piece.",
        pills: ["Reads lighting", "Matches colour tone", "Captures mood"],
        highlighted: true,
      },
      {
        tag: "Team collaboration",
        title: "Your whole team, one shared studio",
        description:
          "Invite designers, marketers, and your agency. Work inside shared projects, review outputs, and publish — no email chains, no file transfers.",
        pills: ["Shared projects", "Review & comment", "Agency ready"],
        highlighted: false,
      },
      {
        tag: "Multi-piece generation",
        title: "Style up to 5 pieces in one image",
        description:
          "Create cohesive campaign shots featuring a full set — necklace, earrings, ring, bracelet — worn together on a model or arranged in a single scene.",
        pills: ["Up to 5 pieces", "Model shots", "Set styling"],
        highlighted: false,
      },
    ],
  },
  who_uses: {
    eye_label: "Who uses Splash",
    title_html: "Built for everyone<br /><em>in the jewelry space</em>",
    items: [
      {
        icon: "Gem",
        title: "D2C Jewelry Brands",
        description:
          "Stop spending ₹25,000–₹1,50,000 per photoshoot. Splash gives you studio-quality product images for your website, Instagram, and marketplace listings — at a fraction of the cost and in a fraction of the time.",
        pills: ["Product catalog", "Instagram content", "Marketplace listings", "Campaign visuals"],
      },
      {
        icon: "Store",
        title: "Traditional Jewelers Going Digital",
        description:
          "Upload one photo of your piece. Get stunning catalog images, ready to share on WhatsApp or your new website. No technical knowledge needed.",
        pills: ["WhatsApp catalog", "Website gallery"],
      },
      {
        icon: "Palette",
        title: "Creative Agencies",
        description:
          "Deliver more for your jewelry clients without adding headcount. Team collaboration, bulk generation, and white-label ready.",
        pills: ["Bulk delivery", "Team projects"],
      },
      {
        icon: "Share2",
        title: "Social Media Managers",
        description:
          "Never run out of jewelry content again. Generate 30 days of social posts in one session with consistent styling.",
        pills: ["Content calendar", "Reels & Stories"],
      },
    ],
  },
  testimonials: {
    eye_label: "Stories",
    title_html: "What jewelry brands<br /><em>are saying</em>",
    items: [
      {
        quote_html:
          '"A single jewellery shoot used to cost us <strong>₹2 lakhs minimum</strong> — studio, photographer, stylist, editing. With Splash we generate the same campaign-quality imagery in minutes, at a fraction of that cost."',
        initials: "TR",
        name: "Tarinika",
        role: "Fine Jewellery Brand",
      },
      {
        quote_html:
          '"We were spending <strong>₹3.5 lakhs+ per shoot</strong> every season. Splash replaced our entire production workflow — we now launch collections faster, with more visual variations, and at a cost that actually makes sense."',
        initials: "PK",
        name: "Paksha",
        role: "Contemporary Jewellery Brand",
      },
      {
        quote_html:
          '"Our Diwali campaign had <strong>5 collections, 200+ images, generated in 2 days</strong>. Previously that would take 3 weeks and a full production crew costing ₹2 lakhs+. Splash is now our primary creative tool."',
        initials: "SN",
        name: "Sneha Nair",
        role: "Marketing Director",
      },
    ],
  },
  pricing: {
    eye_label: "Pricing",
    title_html: "Need pricing details?<br /><em>We'll help you find the best plan for you.</em>",
    card_title:
      "Every jewellery brand is different — the number of products, the type of shoots, the frequency of content.",
    card_description: "We'll understand your needs and help you get the most out of Splash.",
    cta_text: "Contact Us",
    cta_href: "/contact",
  },
  cta: {
    title_html: "Your next collection.<br /><em>Ready before the shoot<br />would've been booked.</em>",
    subtitle: "Start creating jewelry visuals today — your first images are on us.",
    primary_text: "Start creating for free",
    primary_href: "/signup",
    whatsapp_text: "Chat on WhatsApp",
    whatsapp_number: "+918861308898",
    whatsapp_href: "https://wa.me/918861308898",
    note: "No credit card · No prompts · Just your jewelry and Splash",
  },
  footer: {
    logo_url: "/images/SplashLogoPNG.png",
    copyright: "© 2025 Splash AI Studio",
    link_rows: [
      [
        { label: "Instagram", href: "https://www.instagram.com/splash_ai_studios/" },
        { label: "About", href: "/about" },
        { label: "FAQ's", href: "/faqs" },
        { label: "Blogs", href: "/blog" },
      ],
      [
        { label: "Contact", href: "/contact" },
        { label: "Vision & Mission", href: "/vision-mision" },
        { label: "Pricing", href: "/pricing" },
      ],
      [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Security", href: "/security" },
      ],
    ],
  },
};

export const FOOTER_LOGO_PRESET = "/images/SplashLogoPNG.png";

export const ORIGINAL_FOOTER_DEFAULTS = {
  logo_url: FOOTER_LOGO_PRESET,
  copyright: "© 2025 Splash AI Studio",
  link_rows: [
    [
      { label: "Instagram", href: "https://www.instagram.com/splash_ai_studios/" },
      { label: "About", href: "/about" },
      { label: "FAQ's", href: "/faqs" },
      { label: "Blogs", href: "/blog" },
    ],
    [
      { label: "Contact", href: "/contact" },
      { label: "Vision & Mission", href: "/vision-mision" },
      { label: "Pricing", href: "/pricing" },
    ],
    [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  ],
};

/** Flat list derived from link_rows (for consumers that still expect `links`). */
export function flattenFooterLinkRows(linkRows) {
  if (!Array.isArray(linkRows)) return [];
  return linkRows.flat().filter((link) => link?.href && link?.label);
}

export const FAQS_PAGE_DEFAULTS = {
  header: {
    title: "Frequently Asked Questions",
    subtitle: "Quick answers to common questions about Splash AI Studio",
  },
  items: [
    {
      question: "How many credits does each generation cost?",
      answer:
        "Plain images cost 2 credits, themed images cost 8 credits, model images cost 12 credits, and campaign images cost 15 credits.",
    },
    {
      question: "Can I use my own model photos?",
      answer:
        "Yes! You can upload human model photos with plain backgrounds and front or 3/4 angle poses for best results.",
    },
    {
      question: "How long does image generation take?",
      answer:
        "Plain images take 2–3 seconds, themed images 3–4 seconds, model images 4–5 seconds, and campaign images 5–6 seconds.",
    },
    {
      question: "Can I collaborate with team members?",
      answer: "Yes! You can invite collaborators to your projects with Owner, Editor, or Viewer permissions.",
    },
  ],
  cta: {
    title: "Still have questions?",
    subtitle: "Our team is happy to help you understand how Splash AI Studio fits your workflow.",
    button_text: "Contact Us",
    button_href: "/contact",
  },
};

export const CONTACT_PAGE_DEFAULTS = {
  header: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you. Please fill out the form below or reach out to us directly.",
  },
  details: {
    section_title: "Get in Touch",
    office: {
      label: "Office Address",
      lines: [
        "501, Manjeera Majestic Commercial Complex,",
        "JNTU Road,KPHB, Hyderabad , Telangana, India 500085",
      ],
      map_url: "https://maps.app.goo.gl/3tMuX7F4xemYYrxH6",
    },
    phone: {
      label: "Contact Number",
      number: "+91 8790900881",
      tel_href: "tel:+918790900881",
      hours: "Assistance hours: Monday - Sunday 24/7 Hours",
    },
    email: {
      label: "Email Address",
      address: "support@gosplash.ai",
      mailto_href: "mailto:support@gosplash.ai",
      hours: "Assistance hours: Monday - Sunday 24/7 Hours",
    },
  },
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.323180100733!2d78.39097917516732!3d17.492079483413075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910057424ed5%3A0x199dce60198e6b9b!2sTechsprout%20AI%20Labs%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1770624140087!5m2!1sen!2sin",
  form: {
    title: "Have any query?",
    success_title: "Thank you!",
    success_message: "We have received your message and will get back to you shortly.",
    submit_text: "Send Message",
  },
};

function plainTitleToHtml(title) {
  if (!title) return "";
  return title.replace(/\n/g, "<br />");
}

function ensureBlogFooterLink(rows) {
  const hasBlog = rows.some((row) =>
    (Array.isArray(row) ? row : []).some((link) => {
      const href = String(link?.href || "").trim().toLowerCase();
      const label = String(link?.label || "")
        .replace(/<[^>]+>/g, "")
        .trim()
        .toLowerCase();
      return href === "/blog" || href === "/blog/" || label === "blog" || label === "blogs";
    })
  );
  if (hasBlog) return rows;

  const next = rows.map((row) => [...row]);
  if (next[0]) {
    next[0] = [...next[0], { label: "Blogs", href: "/blog" }];
  } else {
    next.push([{ label: "Blogs", href: "/blog" }]);
  }
  return next;
}

function normalizeFooterLinkRows(footer) {
  // Prefer admin/CMS link_rows whenever present
  if (Array.isArray(footer?.link_rows) && footer.link_rows.length > 0) {
    const rows = footer.link_rows
      .map((row) =>
        (Array.isArray(row) ? row : []).filter((link) => link?.href && link?.label)
      )
      .filter((row) => row.length > 0);
    if (rows.length > 0) return ensureBlogFooterLink(rows);
  }

  // Legacy flat `links` array from CMS — chunk into rows of 3
  if (Array.isArray(footer?.links) && footer.links.length > 0) {
    const flat = footer.links.filter((link) => link?.href && link?.label);
    if (flat.length >= 9) {
      return ensureBlogFooterLink([flat.slice(0, 3), flat.slice(3, 6), flat.slice(6, 9)]);
    }
    // Older 4-link footers are incomplete — fall through to defaults
  }

  return ORIGINAL_FOOTER_DEFAULTS.link_rows;
}

function resolveFooter(footer) {
  const logo = footer?.logo_url;
  const usePresetLogo =
    !logo ||
    logo === "/images/logo-splash.png" ||
    logo === "/images/logo-Splash.png";

  const link_rows = normalizeFooterLinkRows(footer);

  return {
    logo_url: usePresetLogo ? FOOTER_LOGO_PRESET : logo,
    copyright: footer?.copyright || ORIGINAL_FOOTER_DEFAULTS.copyright,
    link_rows,
    links: flattenFooterLinkRows(link_rows),
  };
}

function mapLegacyHowSteps(howItWorks, howDefaults) {
  const legacySteps = howItWorks?.steps;
  if (!Array.isArray(legacySteps) || legacySteps.length === 0) return howDefaults;
  return {
    ...howDefaults,
    steps: legacySteps.slice(0, 3).map((step, index) => ({
      number: String(index + 1).padStart(2, "0"),
      title: step.title || "",
      description: step.description || "",
    })),
  };
}

function buildWhatsappHref(number, fallbackHref) {
  const digits = String(number || "").replace(/\D/g, "");
  if (digits) return `https://wa.me/${digits}`;
  return fallbackHref || "";
}

const DEMO_CALENDLY_URL = "https://calendly.com/mousumi-gosplash/30min";

function resolveDemoHref(href) {
  const value = String(href || "").trim();
  if (!value || value === "/contact" || value.endsWith("/contact")) {
    return DEMO_CALENDLY_URL;
  }
  return value;
}

export function resolveHomeContent(raw) {
  const merged = deepMerge(HOME_PAGE_DEFAULTS, raw || {});
  const hero = { ...merged.hero };

  if (raw?.hero?.title && !raw?.hero?.title_html) {
    hero.title_html = plainTitleToHtml(raw.hero.title);
  }
  if (!hero.subtitle && hero.bottom_text) {
    hero.subtitle = hero.bottom_text;
  }
  if (raw?.hero?.bottom_text && !raw?.hero?.subtitle) {
    hero.subtitle = raw.hero.bottom_text;
  }
  hero.cta_primary_href = resolveDemoHref(hero.cta_primary_href);

  const showcase = {
    ...merged.showcase,
    cta_href: merged.showcase?.cta_href || "/gallery",
    marquee_seconds: snapShowcaseSpeed(merged.showcase?.marquee_seconds),
  };
  if (!raw?.showcase?.title_html) {
    if (raw?.showcase?.heading) {
      showcase.title_html = plainTitleToHtml(
        raw.showcase.heading.replace(/ with /i, "<br />with ")
      );
    }
  }

  let how = merged.how;
  if (raw?.how_it_works?.steps?.length && !raw?.how?.steps?.length) {
    how = mapLegacyHowSteps(raw.how_it_works, merged.how);
  }

  let capabilities = merged.capabilities;
  if (raw?.features?.length && !raw?.capabilities?.items?.length) {
    capabilities = {
      ...capabilities,
      items: raw.features.map((feature, index) => ({
        tag: feature.icon || `Feature ${index + 1}`,
        title: feature.title || "",
        description: feature.description || "",
        pills: feature.pills || [],
        highlighted: index < 2,
      })),
    };
  }

  const footer = resolveFooter(merged.footer);

  const cta = {
    ...merged.cta,
    whatsapp_href: merged.cta?.whatsapp_number
      ? buildWhatsappHref(merged.cta.whatsapp_number, merged.cta.whatsapp_href)
      : merged.cta?.whatsapp_href || "",
  };

  return {
    hero,
    ticker: merged.ticker,
    showcase,
    how,
    output: merged.output,
    capabilities,
    who_uses: merged.who_uses,
    testimonials: merged.testimonials,
    pricing: merged.pricing,
    cta,
    footer,
  };
}

export const AUTH_PAGE_DEFAULTS = {
  images: {
    small_url: "/images/login-1.jpg",
    small_alt: "Diamond heart pendant",
    large_url: "/images/login-2.jpg",
    large_alt: "Woman wearing luxury jewelry",
  },
  login: {
    title: "Login",
    subtitle: "Stay connected with us to see magic",
    email_label: "Email",
    email_placeholder: "Example@email.com",
    password_label: "Password",
    password_placeholder: "At least 8 characters",
    forgot_password_text: "Forgot Password?",
    submit_text: "Sign in",
    no_account_text: "Don't have an account?",
    signup_link_text: "Sign Up",
  },
  signup: {
    title: "Sign Up",
    subtitle: "Create your account to get started",
    full_name_label: "Full Name",
    full_name_placeholder: "John Doe",
    username_label: "Username",
    username_placeholder: "johndoe123",
    email_label: "Email",
    email_placeholder: "Example@email.com",
    password_label: "Password",
    password_placeholder: "At least 8 characters",
    confirm_password_label: "Confirm Password",
    confirm_password_placeholder: "Confirm your password",
    submit_text: "Go to verification",
    have_account_text: "Already have an account?",
    login_link_text: "Login",
  },
};

export function resolveFaqsContent(raw) {
  return deepMerge(FAQS_PAGE_DEFAULTS, raw || {});
}

export function resolveAuthContent(raw) {
  return deepMerge(AUTH_PAGE_DEFAULTS, raw || {});
}

export function resolveContactContent(raw) {
  const merged = deepMerge(CONTACT_PAGE_DEFAULTS, raw || {});
  const lines = merged?.details?.office?.lines;

  if (!Array.isArray(lines)) {
    if (typeof lines === "string" && lines.trim()) {
      merged.details.office.lines = lines.includes("\n")
        ? lines.split("\n").map((line) => line.trim()).filter(Boolean)
        : [lines.trim()];
    } else {
      merged.details.office.lines = CONTACT_PAGE_DEFAULTS.details.office.lines;
    }
  }

  return merged;
}
