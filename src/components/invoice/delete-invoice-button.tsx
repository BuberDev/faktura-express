"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteInvoiceAction } from "@/app/actions/invoice";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (isLoading) return; // Prevent closing while loading
    setIsOpen(open);
    if (!open) {
      setConfirmText("");
      setError(null);
    }
  };

  const handleDelete = async () => {
    if (confirmText !== "USUŃ") return;

    setIsLoading(true);
    setError(null);

    const result = await deleteInvoiceAction(invoiceId);

    if (result && result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsOpen(false);
      router.push("/invoices");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-[#E5E5E5] dark:border-[#262626] hover:bg-black/5 dark:hover:bg-white/5 hover:border-gold hover:text-gold-dark dark:hover:border-gold dark:hover:text-gold transition-colors">
          <Trash2 className="mr-2 h-4 w-4" />
          Usuń fakturę
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gold bg-black text-white shadow-gold-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-display tracking-wide text-gold">Usunięcie faktury</DialogTitle>
          <DialogDescription className="text-white/60">
            Czy na pewno chcesz usunąć tę fakturę? Ta operacja jest trwała i nie można jej cofnąć.
            Aby potwierdzić, wpisz słowo <span className="font-bold text-gold uppercase">USUŃ</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="USUŃ" 
            className="border-[#262626] bg-black text-white focus-visible:ring-gold"
            disabled={isLoading}
          />
          {error && <p className="mt-2 text-xs font-medium text-gold">{error}</p>}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="border-[#262626] bg-transparent text-white hover:bg-white/5 hover:text-white"
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleDelete} 
            disabled={confirmText !== "USUŃ" || isLoading}
            className="bg-gold text-black hover:bg-gold/80 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Potwierdź usunięcie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
