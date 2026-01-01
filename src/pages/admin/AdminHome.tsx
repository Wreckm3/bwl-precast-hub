import { useProducts } from "@/hooks/useProducts";
import { useProjects } from "@/hooks/useProjects";
import { useContactSubmissions } from "@/hooks/useContacts";
import { Package, FolderOpen, Mail, TrendingUp } from "lucide-react";

export default function AdminHome() {
  const { data: products } = useProducts();
  const { data: projects } = useProjects();
  const { data: messages } = useContactSubmissions();

  const unreadMessages = messages?.filter((m) => !m.is_read).length || 0;

  const stats = [
    { label: "Total Products", value: products?.length || 0, icon: Package, color: "bg-blue-500" },
    { label: "Projects", value: projects?.length || 0, icon: FolderOpen, color: "bg-green-500" },
    { label: "Messages", value: messages?.length || 0, icon: Mail, color: "bg-orange-500" },
    { label: "Unread", value: unreadMessages, icon: TrendingUp, color: "bg-red-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-lg shadow-md border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="font-display text-4xl text-foreground">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md border border-border">
        <h2 className="font-display text-2xl text-foreground mb-4">Quick Actions</h2>
        <p className="text-muted-foreground">
          Use the sidebar to manage products, projects, and view customer messages.
        </p>
      </div>
    </div>
  );
}
