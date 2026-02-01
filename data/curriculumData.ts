
import { Curriculum } from '../types';

export const curriculumData: Curriculum[] = [
  {
    grade: '4eme',
    sections: ['Mathématiques', 'Sciences Expérimentales', 'Technique', 'Informatique'],
    chapters: [
      {
        id: 'bac-p1',
        subject: 'Physique',
        title: 'Condensateur et Dipôle RC',
        resources: [
          { id: 'r1', title: 'Cours: Le Condensateur', type: 'cours', subject: 'Physique', description: 'Étude de la charge et décharge d\'un condensateur.' },
          { id: 'v1', title: 'Vidéo: Expérience de Charge', type: 'video', subject: 'Physique', description: 'Visualisation de la courbe de charge sur oscilloscope.', isPremium: true, duration: '12:45' },
          { id: 'r2', title: 'Série d\'exercices RC', type: 'exercice', subject: 'Physique', description: 'Exercices d\'application et problèmes types Bac.' }
        ]
      },
      {
        id: 'bac-c1',
        subject: 'Chimie',
        title: 'Cinétique Chimique',
        resources: [
          { id: 'r3', title: 'Cours: Vitesse de réaction', type: 'cours', subject: 'Chimie', description: 'Facteurs cinétiques et suivi temporel.' },
          { id: 'v2', title: 'Vidéo: Correction Bac 2023', type: 'video', subject: 'Chimie', description: 'Résolution détaillée du problème de cinétique.', isPremium: true, duration: '25:10' },
          { id: 'r4', title: 'Correction: Série Cinétique', type: 'exercice', subject: 'Chimie', description: 'Solutions détaillées des exercices du livre.' }
        ]
      }
    ]
  },
  {
    grade: '3eme',
    sections: ['Mathématiques', 'Sciences Expérimentales', 'Technique', 'Informatique'],
    chapters: [
      {
        id: '3-p1',
        subject: 'Physique',
        title: 'Mouvement de Translation',
        resources: [
          { id: 'r5', title: 'Cours complet', type: 'cours', subject: 'Physique', description: 'Cinématique et dynamique du point matériel.' },
          { id: 'v3', title: 'Vidéo: Application des Lois de Newton', type: 'video', subject: 'Physique', description: 'Exemples de calculs de forces.', isPremium: true, duration: '18:20' }
        ]
      }
    ]
  },
  {
    grade: '2eme',
    sections: ['Sciences Expérimentales', 'Technique', 'Informatique'],
    chapters: [
      {
        id: '2-p1',
        subject: 'Physique',
        title: 'Électrostatique',
        resources: [
          { id: 'r6', title: 'Loi de Coulomb', type: 'cours', subject: 'Physique', description: 'Interactions électriques entre charges fixes.' }
        ]
      }
    ]
  },
  {
    grade: '1ere',
    sections: ['Tronc Commun'],
    chapters: [
      {
        id: '1-p1',
        subject: 'Physique',
        title: 'Circuits Électriques en CC',
        resources: [
          { id: 'r7', title: 'Lois des tensions et intensités', type: 'cours', subject: 'Physique', description: 'Base de l\'électricité pour débutants.' }
        ]
      }
    ]
  }
];
