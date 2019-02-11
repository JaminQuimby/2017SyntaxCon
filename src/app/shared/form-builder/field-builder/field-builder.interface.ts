export interface FieldBuilderInterface {
  type: 'text' | 'hidden' | 'dropdown';
  name: string;
  label?: string;
  required?: boolean;
  options?: { id: string, name: string }[];
  container?: string;
  placeholder?: string;
  multiline?: boolean;
}
