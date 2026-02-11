import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/lib/types";

interface TagBadgeProps {
  tag: Tag;
}

export const TagBadge = memo(function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="rounded-md text-[11px] font-medium gap-1.5 py-0 h-5"
      style={{
        backgroundColor: tag.color ? `${tag.color}12` : undefined,
        color: tag.color || undefined,
        borderColor: tag.color ? `${tag.color}25` : undefined,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: tag.color || "currentColor" }}
      />
      {tag.name}
    </Badge>
  );
});
