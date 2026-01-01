import { useContactSubmissions, useMarkContactRead, useDeleteContact } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { format } from "date-fns";

export default function AdminMessages() {
  const { data: messages, isLoading } = useContactSubmissions();
  const markRead = useMarkContactRead();
  const deleteContact = useDeleteContact();

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground mb-8">Messages</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : messages && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-card rounded-lg shadow-md border p-6 ${msg.is_read ? 'border-border' : 'border-accent'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{msg.name}</h3>
                  <p className="text-muted-foreground text-sm">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                  <p className="text-muted-foreground text-xs">{format(new Date(msg.created_at), 'PPp')}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => markRead.mutate({ id: msg.id, is_read: !msg.is_read })}>
                    {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-accent" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteContact.mutate(msg.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="text-foreground">{msg.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No messages yet.</p>
      )}
    </div>
  );
}
