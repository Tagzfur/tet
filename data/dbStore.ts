
import { Resource, User, Grade, Section } from '../types';
import { curriculumData as initialCurriculum } from './curriculumData';

const RESOURCES_KEY = 'bac_physique_resources_v2';
const USERS_KEY = 'bac_physique_users_v1';
const SESSION_KEY = 'bac_physique_session';

export class DataStore {
  // --- RESOURCES MANAGEMENT ---
  private static getInitialResources(): Resource[] {
    const resources: Resource[] = [];
    initialCurriculum.forEach(gradeLevel => {
      gradeLevel.chapters.forEach(chapter => {
        chapter.resources.forEach(res => {
          resources.push({
            ...res,
            grade: gradeLevel.grade,
            section: gradeLevel.sections[0],
            contentUrl: res.contentUrl || '#',
            dateAdded: new Date().toISOString()
          } as Resource);
        });
      });
    });
    return resources;
  }

  static getResources(): Resource[] {
    const stored = localStorage.getItem(RESOURCES_KEY);
    if (!stored) {
      const initial = this.getInitialResources();
      this.saveResources(initial);
      return initial;
    }
    return JSON.parse(stored);
  }

  static saveResources(resources: Resource[]): void {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
  }

  static addResource(resource: Resource): void {
    const resources = this.getResources();
    resources.unshift(resource);
    this.saveResources(resources);
  }

  static updateResource(updated: Resource): void {
    const resources = this.getResources().map(r => r.id === updated.id ? updated : r);
    this.saveResources(resources);
  }

  static deleteResource(id: string): void {
    const resources = this.getResources().filter(r => r.id !== id);
    this.saveResources(resources);
  }

  // --- USER AUTH MANAGEMENT ---
  static getUsers(): User[] {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static registerUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.setSession(user);
  }

  static loginUser(email: string, pass: string): User | null {
    const user = this.getUsers().find(u => u.email === email && u.password === pass);
    if (user) {
      this.setSession(user);
      return user;
    }
    return null;
  }

  static setSession(user: User): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  static getSession(): User | null {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
