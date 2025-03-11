'use client';

import { useCallback, useState } from 'react';

export function useModal(defaultOpen: boolean = false) {
  const [state, setState] = useState<{
    isOpen: boolean;
  }>({ isOpen: defaultOpen });

  const closeModal = useCallback(() => {
    setState(() => ({ isOpen: false }));
  }, []);
  const openModal = useCallback(() => {
    setState({ isOpen: true });
  }, []);

  return { openModal, closeModal, isOpen: state.isOpen };
}
