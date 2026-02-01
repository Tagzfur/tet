
export type Grade = '1ere' | '2eme' | '3eme' | '4eme';

export type Section = 
  | 'Tronc Commun'
  | 'Mathématiques'
  | 'Sciences Expérimentales'
  | 'Technique'
  | 'Informatique'
  | 'Economie et Gestion'
  | 'Lettres';

export type ResourceType = 'cours' | 'exercice' | 'examen' | 'video' | 'serie';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  subject: 'Physique' | 'Chimie';
  contentUrl: string;
  description: string;
  isPremium: boolean;
  grade: Grade;
  section: Section;
  duration?: string;
  dateAdded: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  grade: Grade;
  section: Section;
  isSubscribed: boolean;
}

export type ViewState = 
  | 'home' 
  | 'cours' 
  | 'videos' 
  | 'series' 
  | 'pricing' 
  | 'admin_login' 
  | 'admin_dashboard'
  | 'student_login'
  | 'student_signup';

export interface Chapter {
  id: string;
  subject: 'Physique' | 'Chimie';
  title: string;
  resources: Partial<Resource>[];
}

export interface Curriculum {
  grade: Grade;
  sections: Section[];
  chapters: Chapter[];
}
