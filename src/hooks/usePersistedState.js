import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '../services/storage';

// Igual ao useState, mas carrega o valor salvo no aparelho e grava a cada mudança.
// "ready" fica true quando a leitura inicial termina.
export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadJSON(key, initialValue).then((stored) => {
      if (active) {
        setValue(stored);
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (ready) saveJSON(key, value);
  }, [key, ready, value]);

  return [value, setValue, ready];
}
