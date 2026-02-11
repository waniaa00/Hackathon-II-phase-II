import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RECURRENCE_LABELS, type RecurrenceFrequency } from "@/lib/types";

interface RecurrencePickerProps {
  value?: RecurrenceFrequency | null;
  onChange: (frequency: RecurrenceFrequency | null) => void;
}

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(newValue) => onChange(newValue as RecurrenceFrequency)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="No recurrence" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="daily">{RECURRENCE_LABELS.daily}</SelectItem>
        <SelectItem value="weekly">{RECURRENCE_LABELS.weekly}</SelectItem>
        <SelectItem value="monthly">{RECURRENCE_LABELS.monthly}</SelectItem>
      </SelectContent>
    </Select>
  );
}
