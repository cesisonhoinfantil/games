import { HeaderContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();
  const { zoomPrevention, toggleZoomPrevention } = useSettingsStore();
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  return (
    <div className="h-full w-full landscape:h-auto grid grid-rows-[min-content_1fr]">
      {/* Header */}
      <HeaderContainer className="px-0">
        <Button
          variant={"ghost"}
          className="w-1/3 [&_svg]:size-6 h-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </Button>
        <div className="w-full text-center">Perfil</div>
        <div className="w-1/3 flex justify-center">
          <User />
        </div>
      </HeaderContainer>

      {/* Content */}
      <div className="w-full px-6 flex flex-col items-center gap-6 p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="size-54 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shadow-inner">
            <User size={64} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 font-mono">
            Jogador
          </h2>
        </div>

        {/* Options List */}
        <div className="w-full max-w-sm mt-2 flex flex-col gap-3">
          {/* Accordion Item */}
          <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 font-semibold text-gray-700">
                <Settings size={20} />
                Configurações
              </div>
              {isConfigOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {isConfigOpen && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      Travar Zoom
                    </span>
                    <span className="text-xs text-gray-500">
                      Evita aproximar a tela sem querer.
                    </span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={zoomPrevention}
                      onChange={toggleZoomPrevention}
                    />
                    <div className="w-full h-full rounded-full transition-colors peer-checked:bg-green-500 bg-gray-300"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
