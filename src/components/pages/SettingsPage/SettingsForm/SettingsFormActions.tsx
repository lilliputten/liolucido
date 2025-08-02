'use client';

import React from 'react';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { TSettings } from '@/features/settings/types';

import { TFormData } from './types';

interface TProps {
  settings: TSettings;
  isSubmitEnabled?: boolean;
  isPending?: boolean;
  onCancel?: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  onSubmit: (data: TFormData) => void;
}

export function SettingsFormActions(props: TProps) {
  const { isSubmitEnabled, isPending, onCancel, form, onSubmit } = props;
  const { isDirty } = form.formState;
  const user = useSessionUser();
  const { loadSettings } = useSettingsContext();
  const [isReLoading, startReLoading] = React.useTransition();
  const [isReloadConfirmModalVisible, setReloadConfirmModalVisible] = React.useState(false);
  const doReload = () => {
    startReLoading(async () => {
      const settings = await loadSettings();
      form.reset(settings);
      setReloadConfirmModalVisible(false);
    });
  };
  const ReLoadingIcon = isReLoading ? Icons.spinner : Icons.refresh;
  const SaveIcon = isPending ? Icons.spinner : Icons.check;
  const handleSubmit = form.handleSubmit(onSubmit);
  return (
    <>
      {!isDirty && onCancel && (
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 px-4"
          disabled={isDirty}
          onClick={onCancel}
        >
          <Icons.arrowLeft className="size-4" />
          <span>Back</span>
        </Button>
      )}
      <Button
        className={cn(
          isDev && '__SettingsFormActions_SaveButton', // DEBUG
          'flex gap-2 px-4',
          isPending && 'disabled opacity-50',
        )}
        type="button"
        size="sm"
        variant={isSubmitEnabled ? 'success' : 'disable'}
        disabled={!isSubmitEnabled}
        onClick={handleSubmit}
      >
        <SaveIcon className={cn('size-4', isPending && 'animate-spin')} />{' '}
        <span>{isPending ? 'Saving' : 'Save'}</span>
      </Button>
      {!!user && (
        <Button
          variant="ghost"
          size="sm"
          className={cn('flex gap-2 px-4', isReLoading && 'disabled opacity-50')}
          title="Update settings from server"
          onClick={() => (isDirty ? setReloadConfirmModalVisible(true) : doReload())}
        >
          <Link href="#" className="flex items-center gap-2">
            <ReLoadingIcon className={cn('size-4', isReLoading && 'animate-spin')} />
            <span>{isReLoading ? 'Reloading' : 'Reload'}</span>
          </Link>
        </Button>
      )}
      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => form.reset()}
          className="flex gap-2 px-4"
          disabled={!isDirty}
        >
          <Icons.close className="size-4" />
          <span>Reset changes</span>
        </Button>
      )}
      <ConfirmModal
        dialogTitle="Confirm data loss"
        confirmButtonVariant="theme"
        confirmButtonText="Yes"
        confirmButtonBusyText="Reloading"
        cancelButtonText="No"
        handleClose={() => setReloadConfirmModalVisible(false)}
        handleConfirm={doReload}
        isVisible={isReloadConfirmModalVisible}
        isPending={isReLoading}
      >
        Are you confirming the overwriting of the changed data?
      </ConfirmModal>
    </>
  );
}
