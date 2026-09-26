import React, { useState } from 'react';
import { Project, StarterTemplate, ThemeMode } from '../types';
import { STARTER_TEMPLATES } from '../data/templates';
import { 
  Folder, 
  Plus, 
  Trash2, 
  Clock, 
  FileCode, 
  X, 
  Check, 
  Edit2, 
  LayoutTemplate,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: Project;
  savedProjects: Project[];
  onSaveCurrentProject: (name: string) => void;
  onLoadProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onLoadTemplate: (template: StarterTemplate) => void;
  theme: ThemeMode;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  savedProjects,
  onSaveCurrentProject,
  onLoadProject,
  onDeleteProject,
  onRenameProject,
  onLoadTemplate,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'my-projects' | 'templates'>('my-projects');
  const [projectNameInput, setProjectNameInput] = useState(currentProject.name);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectNameInput.trim()) return;
    onSaveCurrentProject(projectNameInput.trim());
  };

  const handleStartRename = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const handleConfirmRename = (id: string) => {
    if (editName.trim()) {
      onRenameProject(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Project Management"
        className={`w-full max-w-2xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[85vh] ${
          theme === 'dark' ? 'bg-[#0f172a] border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold">Project Management</h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6 bg-neutral-50 dark:bg-[#090d16]">
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'my-projects'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Saved Projects ({savedProjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Starter Templates ({STARTER_TEMPLATES.length})</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'my-projects' ? (
            <>
              {/* Save Current Project Section */}
              <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Save Active Project
                </h3>
                <form onSubmit={handleSave} className="flex gap-2">
                  <input
                    type="text"
                    value={projectNameInput}
                    onChange={(e) => setProjectNameInput(e.target.value)}
                    placeholder="Enter project name..."
                    className="flex-1 px-3 py-2 text-sm rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Project</span>
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Your Local Projects
                </h3>

                {savedProjects.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg">
                    <p className="text-sm">No saved projects found</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Save your active project above to store it in your browser!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {savedProjects.map((project) => (
                      <div
                        key={project.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          currentProject.id === project.id
                            ? 'border-blue-500/50 bg-blue-500/5 dark:bg-blue-500/10'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          {editingId === project.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-2 py-1 text-sm rounded bg-neutral-100 dark:bg-neutral-800 border border-blue-500 outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleConfirmRename(project.id)}
                                className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-neutral-400 hover:bg-neutral-500/10 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm truncate">{project.name}</span>
                              {currentProject.id === project.id && (
                                <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10">
                                  Current
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(project.updatedAt).toLocaleDateString()} {new Date(project.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span>·</span>
                            <span>{project.html.length + project.css.length + project.js.length} bytes</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {currentProject.id !== project.id && (
                            <button
                              onClick={() => {
                                onLoadProject(project);
                                onClose();
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors flex items-center gap-1"
                            >
                              <span>Load</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleStartRename(project)}
                            title="Rename"
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${project.name}"? This cannot be undone.`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                            title="Delete"
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Starter Templates Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STARTER_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="flex flex-col justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-500/50 transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{tmpl.name}</h4>
                      {tmpl.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tmpl.badge === 'SUI.css' 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                        }`}>
                          {tmpl.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                      {tmpl.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Load "${tmpl.name}"? Any unsaved changes in current editor will be replaced.`)) {
                        onLoadTemplate(tmpl);
                        onClose();
                      }
                    }}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-neutral-700 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
