export type ResumeContact = {
  name: string;
  title?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
};

export type ResumeItem = {
  company?: string;
  role?: string;
  org?: string;
  location?: string;
  start?: string;
  end?: string;
  bullets?: string[];
  metrics?: string[];
  technologies?: string[];
};

export type ResumeSection = {
  heading: string;
  items: ResumeItem[];
};

export type ResumeData = {
  contact: ResumeContact;
  summary?: string[];
  sections: ResumeSection[];
};


