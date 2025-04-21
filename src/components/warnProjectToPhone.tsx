import Button from "@/components/animata/button/duolingo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export function WarnProjectToPhone() {
  const [showedWarn, setShowedWarn] = useState<boolean | null>(
    !!localStorage.getItem("showedWarn")
  );

  if (showedWarn) return null;

  const handleClose = () => {
    localStorage.setItem("showedWarn", "true");
    setShowedWarn(true);
  };

  return (
    <Dialog open>
      <DialogContent className="flex items-center [&>button]:hidden">
        <img src="/onomatopeias/png/I.png" className="w-1/5 md:1/6" />
        <div className="w-full h-full flex flex-col justify-center items-center px-1">
          <h1 className="text-xl font-bold">Em desenvolvimento!</h1>
          <p>
            Esse projeto ainda está em desenvolvimento, então muitas coisinhas
            podem mudar, assim como muitos <strong>erros e bugs</strong> podem
            ocorrer, agradecemos a compreensão e <strong>boa jogatina!</strong>
          </p>

          <div className="hidden md:block">
            <Separator className="my-2" />

            <span>
              Atualmente o projeto está sendo desenvolvido pensando em
              dispositivos móveis, então para melhor experiencia aconselhamos
              utilizar um celular
            </span>
          </div>
          <span className="text-muted-foreground block mt-2 text-xs text-center">
            desculpe o incomodo, <br /> essa mensagem irá aparecer apenas desta
            vez
          </span>
          <Button className="mt-4" onClick={handleClose}>
            Vamos lá!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
