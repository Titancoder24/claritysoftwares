import { h } from 'preact';

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onInput, placeholder = 'Search help articles...' }: SearchBarProps) {
  return (
    <div class="sf-search">
      <svg class="sf-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        class="sf-search__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onInput={(e) => onInput((e.target as HTMLInputElement).value)}
      />
    </div>
  );
}
