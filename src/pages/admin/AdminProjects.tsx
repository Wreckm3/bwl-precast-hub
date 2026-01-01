import { useState } from "react";
import { useProjects, useCreateProject, useDeleteProject, Project } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";

export default function AdminProjects() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  const handleSave = async () => {
    if (!newProject.title) return;
    await createProject.mutateAsync({ title: newProject.title, description: newProject.description, images: [] });
    setNewProject({ title: "", description: "" });
    setIsAdding(false);
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
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {isAdding && (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl">New Project</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid gap-4">
            <Input placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
            <Textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
            <Button onClick={handleSave}>Save Project</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <div key={project.id} className="bg-card rounded-lg shadow-md border border-border p-4">
              <h3 className="font-display text-xl mb-2">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                <Trash2 className="w-4 h-4 text-destructive mr-2" /> Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
