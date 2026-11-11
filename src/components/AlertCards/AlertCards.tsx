import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { createPortal } from 'react-dom';
import './AlertCards.css';

interface AlertContainer {
  container: HTMLDivElement | null;
  setContainer: Dispatch<SetStateAction<HTMLDivElement | null>>;
}

const AlertContext = createContext<AlertContainer | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <AlertContext.Provider value={{ container, setContainer }}>
      {children}
    </AlertContext.Provider>
  );
}

// One normal-flow destination below the page header. No fixed positioning or
// z-index: alerts cannot cover the synchronization controls, even on mobile.
export function AlertRegion() {
  const context = useContext(AlertContext);
  return (
    <div
      className="alert-cards"
      aria-label="Alertas"
      ref={context?.setContainer}
    />
  );
}

interface AlertCardProps {
  title: string;
  children: ReactNode;
  tone?: 'error' | 'warning';
}

export function AlertCard({ title, children, tone = 'error' }: AlertCardProps) {
  const context = useContext(AlertContext);
  const [phase, setPhase] = useState<'visible' | 'leaving' | 'hidden'>(
    'visible',
  );

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase('leaving'), 5_000);
    const removeTimer = window.setTimeout(() => setPhase('hidden'), 5_300);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  const card = (
    <div
      className={`alert-card alert-card--${tone}${phase === 'leaving' ? ' alert-card--leaving' : ''}`}
      role="alert"
    >
      <span className="alert-card__icon" aria-hidden="true">
        !
      </span>
      <div className="alert-card__content">
        <strong className="alert-card__title">{title}</strong>
        <div className="alert-card__message">{children}</div>
      </div>
    </div>
  );
  return context?.container ? createPortal(card, context.container) : card;
}
