"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { sendToKSeFAction } from "@/app/actions/invoice";
import { Loader2, Send } from "lucide-react";

interface KSeFSendButtonProps {
  invoiceId: string;
}

export function KSeFSendButton({ invoiceId }: KSeFSendButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSend() {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await sendToKSeFAction(invoiceId);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Faktura wysłana pomyślnie.");
        router.refresh();
      }
    } catch (error) {
      setMessage("Wystąpił błąd komunikacji.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            disabled={isLoading}
            variant="outline" 
            size="sm" 
            className="border-gold text-gold hover:bg-gold/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wysyłanie...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Wyślij do KSeF
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-gold bg-black text-white shadow-gold-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-display tracking-wide text-gold">Wysyłka do KSeF</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Czy na pewno chcesz wysłać tę fakturę do Krajowego Systemu e-Faktur? Ta operacja jest nieodwracalna i spowoduje zablokowanie możliwości dalszej edycji oraz usunięcia dokumentu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#262626] bg-transparent text-white hover:bg-white/5 hover:text-white">Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSend}
              className="bg-gold text-black hover:bg-gold/80"
            >
              Wyślij do KSeF
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {message && (
        <p className={message.includes("pomyślnie") ? "text-xs font-medium text-gold-light" : "text-xs font-medium text-gold"}>
          {message}
        </p>
      )}
    </div>
  );
}
