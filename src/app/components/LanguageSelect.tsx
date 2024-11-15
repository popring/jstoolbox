'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Params {
  languageOptions: {
    value: string;
    label: string;
  }[];
  locale: string;
}

export default function LanguageSelect({ languageOptions, locale }: Params) {
  const handleLanguageChange = (language: string) => {
    document.cookie = `locale=${language}; path=/`;
    window.location.reload();
  };

  return (
    <Select defaultValue={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
