import { useEffect, useRef, useState } from 'react';
import type { OperationDetails as Details } from '../../types/transactions';
import { formatCurrency } from '../../utils/formatters';
import { loadOperationDetails } from './loadOperationDetails';
import { AlertCard } from '../AlertCards/AlertCards';

interface OperationDetailsProps {
  operationId: string;
  onClose: () => void;
}

export default function OperationDetails({
  operationId,
  onClose,
}: OperationDetailsProps) {
  const [details, setDetails] = useState<Details | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    heading.current?.focus();
    loadOperationDetails(operationId)
      .then(result => {
        if (active) setDetails(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [operationId, attempt]);

  const fields = details
    ? [
        ['Ticker', details.ticker],
        [
          details.type === 'BUY'
            ? 'Instituição de compra'
            : 'Instituição de venda',
          details.institution ?? 'Não informada',
        ],
        ['Quantidade', `${details.quantity.toLocaleString('pt-BR')} ações`],
        ['Valor da operação', formatCurrency(details.amount)],
        [
          'Data da operação',
          new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
            new Date(`${details.date}T12:00:00`),
          ),
        ],
      ]
    : [];

  return (
    <section
      className="transactions__details card"
      aria-labelledby="operation-details-title"
    >
      <header>
        <h2 id="operation-details-title" ref={heading} tabIndex={-1}>
          Visualizar operação
        </h2>
        <button
          type="button"
          className="transactions__icon"
          aria-label="Fechar detalhes da operação"
          onClick={onClose}
        >
          ×
        </button>
      </header>
      <small>Demonstração · não representa uma operação da sua carteira</small>
      {error ? (
        <AlertCard title="Detalhes da operação">
          <p>Não foi possível carregar os detalhes da operação.</p>
          <button
            type="button"
            onClick={() => {
              setError(false);
              setAttempt(value => value + 1);
            }}
          >
            Tentar novamente
          </button>
        </AlertCard>
      ) : details ? (
        <>
          <span
            className={`transactions__badge transactions__badge--${details.type.toLowerCase()}`}
          >
            {details.type === 'BUY' ? 'Compra' : 'Venda'}
          </span>
          <p>Detalhes da operação selecionada</p>
          <dl>
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p role="status">Carregando detalhes da operação...</p>
      )}
      <footer>
        <button type="button" onClick={onClose}>
          Fechar
        </button>
        <button
          type="button"
          className="transactions__delete"
          disabled
          title="Exclusão de operações ainda não disponível"
        >
          Excluir operação
        </button>
      </footer>
    </section>
  );
}
