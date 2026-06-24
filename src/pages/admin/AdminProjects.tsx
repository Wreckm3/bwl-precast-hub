import { useState, useRef } from "react";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, Project } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminProjects() {
  const { data: projects, isLoading } = useProjects();
  const { toast } = useToast();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const handleSave = async () => {
    if (!editingProject?.title) return;
    const payload = {
      title: editingProject.title,
      description: editingProject.description || null,
      images: editingProject.images || [],
    };
    if (editingProject.id) {
      await updateProject.mutateAsync({ id: editingProject.id, ...payload });
    } else {
      await createProject.mutateAsync(payload);
    }
    setIsEditing(false);
    setEditingProject(null);
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingProject) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      newUrls.push(urlData.publicUrl);
    }
    setEditingProject({ ...editingProject, images: [...(editingProject.images || []), ...newUrls] });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProject) return;
    const updated = [...(editingProject.images || [])];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, images: updated });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this project?")) {
      await deleteProject.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-foreground">Projects</h1>
        <Button onClick={() => { setEditingProject({ images: [] }); setIsEditing(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {isEditing && editingProject && (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl">{editingProject.id ? "Edit Project" : "New Project"}</h2>
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setEditingProject(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid gap-4">
            <Input
              placeholder="Project Title"
              value={editingProject.title || ""}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={editingProject.description || ""}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium">Project Images</label>
              <div className="flex flex-wrap gap-3">
                {(editingProject.images || []).map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  {uploading ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Add</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUploadImages}
              />
            </div>

            <Button onClick={handleSave}>Save Project</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <div key={project.id} className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
              {project.images?.[0] && (
                <img src={project.images[0]} alt={project.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-display text-xl mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingProject(project); setIsEditing(true); }}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-4 h-4 text-destructive mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
