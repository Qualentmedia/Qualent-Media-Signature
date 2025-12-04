
export interface ContactField {
  id: string;
  label: string;
  value: string;
}

export interface SocialLinks {
  linkedin: string;
  calendly: string;
  twitter: string;
  youtube: string;
  instagram: string;
}

export interface SignatureConfig {
  fullName: string;
  jobTitle: string;
  logo: string | null; // URL string
  logoLink: string; // URL string for anchor tag
  banner: string | null; // URL string
  bannerLink: string; // URL string for anchor tag
  contactFields: ContactField[];
  socialLinks: SocialLinks;
  disclaimer: string;
}

export interface GeneratedResult {
  html: string;
  tips: string;
}
