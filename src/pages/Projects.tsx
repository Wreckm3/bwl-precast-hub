import { Layout } from "@/components/layout/Layout";
import { useProjects } from "@/hooks/useProjects";
import concreteTexture from "@/assets/concrete-texture.jpg";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout>
      <section className="bg-primary py-20">
        <div className="container-custom text-center">
          <p className="text-accent font-semibold uppercase tracking-widest mb-2">Our Work</p>
          <h1 className="heading-xl text-primary-foreground mb-4">Project Gallery</h1>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
            Explore our completed projects across Kenya
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-12">Loading projects...</div>
          ) : projects && projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group overflow-hidden rounded-lg shadow-lg">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={project.images?.[0] || concreteTexture}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <h3 className="font-display text-2xl text-primary-foreground">{project.title}</h3>
                        {project.description && (
                          <p className="text-primary-foreground/80 text-sm mt-1">{project.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-xl">Gallery coming soon</p>
              <p>We're preparing our project showcase.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
