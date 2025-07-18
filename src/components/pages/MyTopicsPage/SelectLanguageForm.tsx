'use client';

import React from 'react';

import { TSelectTopicLanguageData } from '@/shared/types/language';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Icons } from '@/components/shared/icons';

interface SelectLanguageFormProps extends TSelectTopicLanguageData {
  className?: string;
  handleConfirm: (data: TSelectTopicLanguageData) => void;
  handleClose: () => void;
  isPending?: boolean;
}

export function SelectLanguageForm(props: SelectLanguageFormProps) {
  const { className, handleConfirm, handleClose, isPending, langCode: initialLangCode } = props;
  const [selectedLanguage, setSelectedLanguage] = React.useState(initialLangCode || 'en');
  const [customLanguage, setCustomLanguage] = React.useState('');
  const [isCustom, setIsCustom] = React.useState(false);

  const handleLanguageChange = (value: string) => {
    console.log('[SelectLanguageForm:handleLanguageChange]', {
      value,
    });
    debugger;
    if (value === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedLanguage(value);
    }
  };

  const onConfirm = () => {
    // Determine the final language code and name
    const finalLangCode = isCustom ? customLanguage : selectedLanguage;
    const finalLangName = isCustom
      ? customLanguage
      : (() => {
          switch (selectedLanguage) {
            case 'en':
              return 'English';
            case 'ru':
              return 'Russian';
            case 'fr':
              return 'French';
            default:
              return '';
          }
        })();
    console.log('[SelectLanguageForm:onConfirm]', {
      finalLangCode,
      finalLangName,
      isCustom,
    });
    debugger;

    // Call the handleConfirm with the selected language
    handleConfirm({
      langCode: finalLangCode,
      langName: finalLangName,
      langCustom: isCustom,
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <RadioGroup
        defaultValue={initialLangCode || 'en'}
        onValueChange={handleLanguageChange}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="en" id="en" />
          <Label htmlFor="en">English</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="ru" id="ru" />
          <Label htmlFor="ru">Russian</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fr" id="fr" />
          <Label htmlFor="fr">French</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom</Label>
        </div>
      </RadioGroup>

      {isCustom && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="customLanguage">Custom Language Code</Label>
          <Input
            id="customLanguage"
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            placeholder="e.g., de, es, it"
            className="w-full"
          />
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending || (isCustom && !customLanguage)}
          className="gap-2"
        >
          {isPending && <Icons.spinner className="size-4 animate-spin" />}
          Confirm
        </Button>
      </div>
    </div>
  );
}
