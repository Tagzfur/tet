
import React, { useState, useEffect, useMemo } from 'react';
import { Grade, Section, Resource, ViewState, ResourceType, User } from './types';
import { DataStore } from './data/dbStore';

// --- ICONS ---
const GraduationCap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const Book = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const Play = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>;
const FileText = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const Lock = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Search = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const Plus = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Trash = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const Edit = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const Check = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const UserIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade>('4eme');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    setResources(DataStore.getResources());
    setCurrentUser(DataStore.getSession());
  }, []);

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    DataStore.logout();
    setCurrentUser(null);
    navigateTo('home');
  };

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGrade = res.grade === selectedGrade;
      const matchView = (currentView === 'cours' && res.type === 'cours') ||
                        (currentView === 'videos' && res.type === 'video') ||
                        (currentView === 'series' && (res.type === 'serie' || res.type === 'exercice' || res.type === 'examen')) ||
                        (currentView === 'home');
      return matchSearch && matchGrade && matchView;
    });
  }, [resources, searchTerm, selectedGrade, currentView]);

  const handleResourceClick = (res: Resource) => {
    if (!currentUser) {
      alert('🔒 Accès restreint : Veuillez créer un compte gratuit pour voir ce document.');
      navigateTo('student_signup');
      return;
    }
    if (res.isPremium && !currentUser.isSubscribed) {
      navigateTo('pricing');
      return;
    }
    window.open(res.contentUrl, '_blank');
  };

  // --- COMPOSANTS DE L'INTERFACE ---

  const Navbar = () => (
    <nav className="gradient-bg text-white shadow-xl sticky top-0 z-[100] px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-24">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
          <div className="bg-white/20 p-2.5 rounded-2xl border border-white/20 shadow-inner">
            <GraduationCap />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase leading-none">
            BacPhysique<br/><span className="text-yellow-400">Chimie.tn</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-6 font-bold text-[10px] tracking-[0.2em]">
          <button onClick={() => navigateTo('home')} className={`hover:text-yellow-300 transition-colors uppercase ${currentView === 'home' ? 'text-yellow-400' : ''}`}>Accueil</button>
          <button onClick={() => navigateTo('cours')} className={`hover:text-yellow-300 transition-colors uppercase ${currentView === 'cours' ? 'text-yellow-400' : ''}`}>Cours</button>
          <button onClick={() => navigateTo('videos')} className={`hover:text-yellow-300 transition-colors uppercase ${currentView === 'videos' ? 'text-yellow-400' : ''}`}>Vidéos</button>
          <button onClick={() => navigateTo('series')} className={`hover:text-yellow-300 transition-colors uppercase ${currentView === 'series' ? 'text-yellow-400' : ''}`}>Séries</button>
          
          <div className="h-8 w-px bg-white/20 mx-2" />

          {currentUser ? (
            <div className="flex items-center gap-4 group cursor-pointer bg-white/10 pr-2 pl-4 py-2 rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
              <div className="flex flex-col items-end">
                <span className="text-[8px] opacity-60 uppercase">Mon Espace 2026</span>
                <span className="text-white font-black text-xs">{currentUser.fullName.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="bg-red-500/80 p-2 rounded-xl hover:bg-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => navigateTo('student_login')} className="hover:text-yellow-300 uppercase">Login</button>
              <button onClick={() => navigateTo('student_signup')} className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-2xl shadow-lg shadow-yellow-400/20 active:scale-95 transition-all">S'INSCRIRE</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  const StudentSignUp = () => {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', grade: '4eme' as Grade, section: 'Mathématiques' as Section });
    const handleSignUp = (e: React.FormEvent) => {
      e.preventDefault();
      const newUser: User = { ...form, id: Math.random().toString(36).substr(2, 9), isSubscribed: false };
      DataStore.registerUser(newUser);
      setCurrentUser(newUser);
      alert('Bienvenue ! Votre compte 2026 est prêt.');
      navigateTo('home');
    };
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="bg-white p-12 rounded-[3rem] border-4 border-blue-50 shadow-2xl space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-2">Rejoignez-nous</h2>
            <p className="text-slate-500 font-bold">L'inscription est obligatoire pour accéder aux ressources 2026.</p>
          </div>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nom Complet</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" placeholder="Mohamed Ali" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Téléphone</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" placeholder="+216 98 ..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email</label>
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" type="email" placeholder="nom@exemple.tn" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Mot de passe</label>
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Niveau</label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none" value={form.grade} onChange={e => setForm({...form, grade: e.target.value as any})}>
                  <option value="4eme">4ème Année (BAC)</option>
                  <option value="3eme">3ème Année</option>
                  <option value="2eme">2ème Année</option>
                  <option value="1ere">1ère Année</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Section</label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none" value={form.section} onChange={e => setForm({...form, section: e.target.value as any})}>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Sciences Expérimentales">Sciences</option>
                  <option value="Technique">Technique</option>
                  <option value="Informatique">Informatique</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-6 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all">CRÉER MON COMPTE GRATUIT</button>
          </form>
          <p className="text-center text-sm font-bold text-slate-400">Déjà inscrit ? <button type="button" onClick={() => navigateTo('student_login')} className="text-blue-600 hover:underline">Connectez-vous ici</button></p>
        </div>
      </div>
    );
  };

  const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = DataStore.loginUser(email, pass);
      if (user) { setCurrentUser(user); navigateTo('home'); }
      else alert('Compte non trouvé ou mot de passe incorrect.');
    };
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] border shadow-2xl space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">Bon retour !</h2>
            <p className="text-slate-500 font-bold">Identifiez-vous pour continuer.</p>
          </div>
          <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none" type="password" placeholder="Mot de passe" value={pass} onChange={e => setPass(e.target.value)} />
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest mt-6 shadow-xl shadow-slate-200 hover:bg-black transition-all">SE CONNECTER</button>
          <button type="button" onClick={() => navigateTo('student_signup')} className="w-full text-center text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Créer un compte</button>
        </form>
      </div>
    );
  };

  const AdminDashboard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Resource>>({ type: 'cours', subject: 'Physique', grade: '4eme', section: 'Mathématiques', isPremium: true });

    const handleAction = (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditing) {
        DataStore.updateResource(formData as Resource);
        alert('✅ Document mis à jour avec succès !');
      } else {
        const newRes: Resource = { ...formData, id: Math.random().toString(36).substr(2, 9), dateAdded: new Date().toISOString() } as Resource;
        DataStore.addResource(newRes);
        alert('✅ Document publié avec succès !');
      }
      setResources(DataStore.getResources());
      resetForm();
    };

    const resetForm = () => {
      setFormData({ type: 'cours', subject: 'Physique', grade: '4eme', section: 'Mathématiques', isPremium: true });
      setIsEditing(false);
    };

    const startEdit = (res: Resource) => {
      setFormData(res);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Portail Professeur 2026</h2>
            <p className="text-slate-500 font-bold mt-2">Gestionnaire de contenu et d'abonnements.</p>
          </div>
          <button onClick={() => { setIsAdminLoggedIn(false); navigateTo('home'); }} className="bg-red-50 text-red-600 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all">Quitter Admin</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulaire Dynamique */}
          <div className="lg:col-span-1">
            <form onSubmit={handleAction} className={`bg-white p-8 rounded-[2.5rem] border-4 ${isEditing ? 'border-orange-500' : 'border-blue-600'} shadow-2xl sticky top-32 transition-all`}>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                   {isEditing ? <Edit /> : <Plus />}
                </div>
                {isEditing ? 'Modifier le cours' : 'Publier un cours'}
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Titre du document</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-sm outline-none focus:border-blue-500 transition-all" placeholder="Ex: Étude du Dipôle RL" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Description courte</label>
                  <textarea required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-sm h-28 outline-none focus:border-blue-500 transition-all" placeholder="Détails pour les élèves..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Type</label>
                    <select className="w-full bg-slate-50 border rounded-xl p-3 font-bold text-xs" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                      <option value="cours">📄 Cours</option>
                      <option value="video">🎥 Vidéo</option>
                      <option value="serie">📚 Série</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Niveau</label>
                    <select className="w-full bg-slate-50 border rounded-xl p-3 font-bold text-xs" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value as any})}>
                      <option value="4eme">4ème BAC</option>
                      <option value="3eme">3ème</option>
                      <option value="2eme">2ème</option>
                      <option value="1ere">1ère</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">URL (Lien vers serveur 100Go ou YouTube)</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-sm outline-none" placeholder="https://votredomaine.tn/videos/..." value={formData.contentUrl} onChange={e => setFormData({...formData, contentUrl: e.target.value})} />
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} />
                  <span className="font-bold text-xs text-slate-700">Contenu Premium (Payant)</span>
                </div>

                <div className="flex gap-3 pt-4">
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="flex-grow bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
                  )}
                  <button type="submit" className={`flex-grow ${isEditing ? 'bg-orange-500' : 'bg-blue-600'} text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all`}>
                    {isEditing ? 'METTRE À JOUR' : 'PUBLIER MAINTENANT'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Liste des Ressources Gérées */}
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-white rounded-[3rem] border shadow-2xl overflow-hidden p-4">
                <div className="p-6 border-b flex justify-between items-center">
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Gestion des publications ({resources.length})</h4>
                  <div className="text-[10px] font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full uppercase">Année Scolaire 2026</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-8 py-6">Document</th>
                        <th className="px-8 py-6">Niveau</th>
                        <th className="px-8 py-6">Accès</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {resources.map(res => (
                        <tr key={res.id} className="hover:bg-slate-50 group transition-all">
                          <td className="px-8 py-6">
                            <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{res.title}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{res.type} — {res.subject}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg font-black text-[10px]">{res.grade}</span>
                          </td>
                          <td className="px-8 py-6">
                            {res.isPremium ? (
                              <span className="text-amber-500 font-black text-[10px] uppercase flex items-center gap-1.5"><Lock /> Premium</span>
                            ) : (
                              <span className="text-green-500 font-black text-[10px] uppercase">Libre</span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right space-x-4">
                            <button onClick={() => startEdit(res)} className="text-blue-500 hover:scale-125 transition-transform"><Edit /></button>
                            <button onClick={() => { if(confirm('Voulez-vous vraiment supprimer ce document ?')) { DataStore.deleteResource(res.id); setResources(DataStore.getResources()); } }} className="text-red-400 hover:text-red-600 hover:scale-125 transition-transform"><Trash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const ResourceCard = ({ res }: { res: Resource }) => (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all group flex flex-col relative">
      <div className={`h-48 relative flex items-center justify-center overflow-hidden ${res.type === 'video' ? 'bg-orange-50' : res.subject === 'Physique' ? 'bg-blue-50' : 'bg-pink-50'}`}>
        <div className="scale-150 opacity-10 absolute group-hover:rotate-12 group-hover:scale-[2] transition-all duration-700">
          {res.type === 'video' ? <Play /> : res.type === 'cours' ? <Book /> : <FileText />}
        </div>
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          {res.type === 'video' ? <Play /> : res.type === 'cours' ? <Book /> : <FileText />}
        </div>
        {res.isPremium && (!currentUser?.isSubscribed) && (
          <div className="absolute top-6 right-6 bg-amber-500 text-white p-3 rounded-2xl shadow-xl shadow-amber-500/20 animate-pulse">
            <Lock />
          </div>
        )}
        <div className="absolute bottom-6 left-6 flex gap-2">
           <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">{res.grade}</span>
           <span className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">{res.type}</span>
        </div>
      </div>
      <div className="p-10 flex-grow flex flex-col">
        <h3 className="font-black text-slate-800 mb-3 leading-tight group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{res.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-10 font-medium leading-relaxed italic">"{res.description}"</p>
        <button onClick={() => handleResourceClick(res)} className="mt-auto w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95">Ouvrir le document</button>
      </div>
    </div>
  );

  const PageHeader = ({ title, highlight, desc }: { title: string, highlight: string, desc: string }) => (
    <div className="mb-20 text-center md:text-left">
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-[0.85]">
        {title} <br/><span className="text-blue-600 outline-text">{highlight}</span>
      </h1>
      <p className="text-slate-500 font-black text-lg max-w-xl leading-relaxed opacity-70 border-l-4 border-yellow-400 pl-6">{desc}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-yellow-200 selection:text-blue-900">
      <Navbar />

      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="py-20 max-w-7xl mx-auto px-4">
             <PageHeader 
                title="Préparation Bac" 
                highlight="Édition 2026" 
                desc="La réussite n'est pas un secret, c'est une méthode. Accédez aux meilleurs cours de Physique & Chimie de Tunisie." 
             />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredResources.slice(0, 6).map(res => <ResourceCard key={res.id} res={res} />)}
             </div>
             
             {/* Section CTA 2026 */}
             <div className="mt-32 bg-blue-600 rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
                <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter relative z-10">Promo Spéciale Janvier 2026</h2>
                <p className="text-xl font-bold mb-12 opacity-80 relative z-10">L'abonnement annuel est à moitié prix pour toute inscription avant le 31.</p>
                <button onClick={() => navigateTo('pricing')} className="bg-yellow-400 text-blue-900 px-12 py-5 rounded-3xl font-black uppercase text-sm tracking-widest relative z-10 hover:scale-105 active:scale-95 transition-all shadow-2xl">Profiter de l'offre</button>
             </div>
          </div>
        )}

        {currentView === 'cours' && (
          <div className="py-20 max-w-7xl mx-auto px-4">
             <PageHeader title="Bibliothèque" highlight="Cours 2026" desc="Des résumés clairs et des fiches de cours conformes au nouveau programme tunisien." />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredResources.map(res => <ResourceCard key={res.id} res={res} />)}
             </div>
          </div>
        )}

        {currentView === 'videos' && (
          <div className="py-20 max-w-7xl mx-auto px-4">
             <PageHeader title="Leçons Vidéo" highlight="Expériences HD" desc="Visualisez les phénomènes physiques et les manipulations de chimie comme si vous étiez au labo." />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredResources.map(res => <ResourceCard key={res.id} res={res} />)}
             </div>
          </div>
        )}

        {currentView === 'series' && (
          <div className="py-20 max-w-7xl mx-auto px-4">
             <PageHeader title="Entrainement" highlight="Séries 2026" desc="Pratiquez avec nos séries d'exercices progressives et nos examens blancs corrigés." />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredResources.map(res => <ResourceCard key={res.id} res={res} />)}
             </div>
          </div>
        )}

        {currentView === 'student_signup' && <StudentSignUp />}
        {currentView === 'student_login' && <StudentLogin />}
        
        {currentView === 'admin_login' && (
          <div className="min-h-[80vh] flex items-center justify-center px-4">
            <form onSubmit={(e) => { e.preventDefault(); navigateTo('admin_dashboard'); setIsAdminLoggedIn(true); }} className="bg-white p-12 rounded-[3rem] shadow-3xl border-4 border-slate-900 w-full max-w-md transform hover:rotate-1 transition-transform">
               <div className="text-center mb-10">
                 <div className="bg-slate-900 text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"><Lock /></div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Espace Professeur</h2>
                 <p className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.3em] mt-2">Accès restreint 2026</p>
               </div>
               <div className="space-y-4">
                 <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all" placeholder="Identifiant Prof" />
                 <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-600 transition-all" type="password" placeholder="Mot de passe" />
                 <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all mt-4">Vérifier Identité</button>
               </div>
            </form>
          </div>
        )}
        
        {currentView === 'admin_dashboard' && isAdminLoggedIn && <AdminDashboard />}
        
        {currentView === 'pricing' && (
          <div className="py-20 max-w-7xl mx-auto px-4 text-center">
             <PageHeader title="Nos Packs" highlight="Réussite 2026" desc="Inscrivez-vous dès maintenant pour débloquer l'intégralité du contenu premium." />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                <div className="bg-white p-12 rounded-[4rem] border shadow-xl hover:border-blue-600 transition-all">
                   <h3 className="text-2xl font-black mb-4">Pack Mensuel</h3>
                   <div className="text-6xl font-black text-slate-900 mb-10 tracking-tighter">25 <span className="text-sm font-bold opacity-40">TND/mois</span></div>
                   <ul className="text-left space-y-4 mb-12 font-bold text-slate-500">
                     <li className="flex items-center gap-3"><div className="text-green-500"><Check /></div> Tous les cours PDF</li>
                     <li className="flex items-center gap-3"><div className="text-green-500"><Check /></div> Vidéos d'exercices</li>
                   </ul>
                   <button className="w-full bg-slate-100 py-5 rounded-3xl font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all">Choisir</button>
                </div>
                <div className="bg-blue-600 p-12 rounded-[4rem] border-4 border-yellow-400 shadow-2xl scale-105 text-white">
                   <h3 className="text-2xl font-black mb-4">Pack Annuel</h3>
                   <div className="text-6xl font-black mb-10 tracking-tighter">150 <span className="text-sm font-bold opacity-60">TND/an</span></div>
                   <ul className="text-left space-y-4 mb-12 font-bold opacity-80">
                     <li className="flex items-center gap-3"><Check /> Accès illimité 2026</li>
                     <li className="flex items-center gap-3"><Check /> Support WhatsApp Direct</li>
                     <li className="flex items-center gap-3"><Check /> Devoirs Lycées Pilotes</li>
                   </ul>
                   <button className="w-full bg-yellow-400 py-5 rounded-3xl font-black uppercase tracking-widest text-blue-900 shadow-2xl hover:scale-105 transition-all">Meilleur Choix</button>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Footer 2026 */}
      <footer className="bg-slate-900 text-white py-24 mt-32 border-t-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10"><GraduationCap /></div>
              <span className="text-3xl font-black uppercase tracking-tighter">BacPhysiqueChimie.tn</span>
            </div>
            <p className="text-slate-500 text-lg font-bold leading-relaxed max-w-md mb-12 italic">"Le savoir est la seule ressource qui s'accroit quand on la partage. Bienvenue dans l'élite tunisienne de 2026."</p>
            <div className="flex gap-4">
              <button onClick={() => navigateTo('admin_login')} className="text-[9px] font-black text-white/30 hover:text-white border border-white/10 px-6 py-2 rounded-full uppercase tracking-[0.3em] transition-all">Accès Professeur</button>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-[10px] text-blue-400 uppercase mb-10 tracking-[0.4em]">Plateforme</h4>
            <ul className="space-y-6 text-xs font-black text-slate-500 uppercase tracking-widest">
              <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Accueil</button></li>
              <li><button onClick={() => navigateTo('cours')} className="hover:text-white transition-colors">Bibliothèque</button></li>
              <li><button onClick={() => navigateTo('videos')} className="hover:text-white transition-colors">Vidéos 2026</button></li>
              <li><button onClick={() => navigateTo('series')} className="hover:text-white transition-colors">Séries Corrigées</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-[10px] text-yellow-400 uppercase mb-10 tracking-[0.4em]">Contact & Support</h4>
            <div className="space-y-8">
               <div>
                  <p className="text-[10px] font-black opacity-40 uppercase mb-2">WhatsApp Direct</p>
                  <p className="text-2xl font-black">+216 00 000 000</p>
               </div>
               <div>
                  <p className="text-[10px] font-black opacity-40 uppercase mb-2">Paiement D17</p>
                  <p className="text-sm font-black">Identifiant : 21000000</p>
               </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] gap-4">
           <span>© 2026 BacPhysiqueChimie.tn — Tunis, Tunisie</span>
           <span>Propulsé par votre serveur 100Go</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
