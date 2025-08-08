export interface TimelineEvent {
  id: string;
  title: string;
  start: string;   // ISO string
  end: string;     // ISO string
  allDay?: boolean;
  colorId?: string;
  // Plus any other fields your API can provide
}
