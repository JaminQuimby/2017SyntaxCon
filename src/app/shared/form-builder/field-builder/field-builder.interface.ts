export interface FieldBuilderInterface {
  type: 'text' | 'hidden' | 'dropdown';
  name: string;
  label?: string;
  required?: boolean;
  options?: { key: string, label: string }[];
}
