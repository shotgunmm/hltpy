type ColumnDef = {
  label: string;
  sort_key?: string;
  width?: number; 
  align?: 'left' | 'right' | 'center';
  className?: string;
}