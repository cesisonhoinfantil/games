import { useMatchStore } from "../stores/useMatchStore";
import { MatchTile } from "./MatchTile";

export function MatchBoard() {
  const { itemsA, itemsB, selectedA, selectedB, selectItemA, selectItemB } = useMatchStore();

  const isSelectionBlocked = !!(selectedA && selectedB);

  return (
    <div className="flex flex-1 w-full max-w-4xl mx-auto px-4 gap-6 relative items-center justify-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        {itemsA.map((item) => (
          <MatchTile
            key={item.id}
            item={item}
            isSelected={selectedA === item.id}
            onClick={() => selectItemA(item.id)}
            disabled={isSelectionBlocked}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        {itemsB.map((item) => (
          <MatchTile
            key={item.id}
            item={item}
            isSelected={selectedB === item.id}
            onClick={() => selectItemB(item.id)}
            disabled={isSelectionBlocked}
          />
        ))}
      </div>
    </div>
  );
}
