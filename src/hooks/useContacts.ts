import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useContactSubmissions() {
  return useQuery({
    queryKey: ["contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactSubmission[];
    },
  });
}

export function useSubmitContact() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contact: { name: string; email: string; phone?: string | null; message: string }) => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Message sent successfully", description: "We'll get back to you soon!" });
    },
    onError: (error) => {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
    },
  });
}

export function useMarkContactRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_submissions"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_submissions"] });
      toast({ title: "Message deleted" });
    },
    onError: (error) => {
      toast({ title: "Error deleting message", description: error.message, variant: "destructive" });
    },
  });
}
