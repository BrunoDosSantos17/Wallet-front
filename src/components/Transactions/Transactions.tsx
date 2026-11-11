import { lazy, Suspense, useEffect, useState } from 'react';
import { demonstrationOperations } from '../../data/transactions';
import { formatCurrency } from '../../utils/formatters';
import './Transactions.css';

const OperationDetails = lazy(() => import('./OperationDetails'));
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

interface TransactionsProps {
  onBack: () => void;
}

export function Transactions({ onBack }: TransactionsProps) {
  const [menuId, setMenuId] = useState<string | null>(null);
  const [operationId, setOperationId] = useState<string | null>(null);

  useEffect(() => {
    function closeMenu(event: PointerEvent) {
      if (
        event.target instanceof Element &&
        !event.target.closest('.transactions__actions')
      )
        setMenuId(null);
    }
    document.addEventListener('pointerdown', closeMenu);
    return () => document.removeEventListener('pointerdown', closeMenu);
  }, []);

  function closeDetails() {
    setOperationId(null);
    document.getElementById(`transaction-actions-${operationId}`)?.focus();
  }

  return (
    <section
      className="transactions"
      aria-labelledby="transactions-title"
      onKeyDown={event => {
        if (event.key !== 'Escape') return;
        if (menuId) {
          document.getElementById(`transaction-actions-${menuId}`)?.focus();
          setMenuId(null);
        } else if (operationId) closeDetails();
      }}
    >
      <button type="button" className="transactions__back" onClick={onBack}>
        ← Voltar para carteira
      </button>
      <header className="transactions__heading">
        <h1 id="transactions-title">Movimentações</h1>
        <p>Histórico de compras e vendas da sua carteira.</p>
      </header>
      <p className="transactions__notice" role="note">
        <strong>Prévia de demonstração.</strong> Dados fictícios do design, sem
        vínculo com a carteira selecionada. Histórico real ainda não disponível.
      </p>
      <div
        className={`transactions__layout ${operationId ? 'transactions__layout--with-details' : ''}`}
      >
        <div className="transactions__main">
          <section
            className="transactions__summary"
            aria-label="Resumo demonstrativo de movimentações"
          >
            <article>
              <span>COMPRAS NO MÊS · EXEMPLO</span>
              <strong>{formatCurrency(8740)}</strong>
            </article>
            <article>
              <span>VENDAS NO MÊS · EXEMPLO</span>
              <strong className="transactions__sale">
                {formatCurrency(3120)}
              </strong>
            </article>
          </section>
          <section
            className="transactions__table card"
            aria-labelledby="operations-title"
          >
            <h2 id="operations-title">Operações recentes</h2>
            <p className="transactions__period">
              Exemplos de abril e maio de 2024 · valores ilustrativos do design
            </p>
            <div className="transactions__scroll">
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Ticker</th>
                    <th>Data</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                    <th>
                      <span className="transactions__sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {demonstrationOperations.map(operation => (
                    <tr key={operation.id}>
                      <td>
                        <span
                          className={`transactions__badge transactions__badge--${operation.type.toLowerCase()}`}
                        >
                          {operation.type === 'BUY' ? 'Compra' : 'Venda'}
                        </span>
                      </td>
                      <th scope="row">{operation.ticker}</th>
                      <td>
                        <time dateTime={operation.date}>
                          {dateFormatter.format(
                            new Date(`${operation.date}T12:00:00`),
                          )}
                        </time>
                      </td>
                      <td>{operation.quantity.toLocaleString('pt-BR')}</td>
                      <td
                        className={
                          operation.type === 'SELL'
                            ? 'transactions__sale'
                            : 'transactions__purchase'
                        }
                      >
                        {formatCurrency(operation.amount)}
                      </td>
                      <td className="transactions__actions">
                        <button
                          id={`transaction-actions-${operation.id}`}
                          type="button"
                          className="transactions__icon"
                          aria-label={`Ações da operação ${operation.ticker}`}
                          aria-expanded={menuId === operation.id}
                          aria-controls={
                            menuId === operation.id
                              ? `operation-menu-${operation.id}`
                              : undefined
                          }
                          onClick={() =>
                            setMenuId(current =>
                              current === operation.id ? null : operation.id,
                            )
                          }
                        >
                          ⋮
                        </button>
                        {menuId === operation.id && (
                          <div
                            className="transactions__menu"
                            id={`operation-menu-${operation.id}`}
                            role="group"
                            aria-label={`Ações de ${operation.ticker}`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setOperationId(operation.id);
                                setMenuId(null);
                              }}
                            >
                              Visualizar operação
                            </button>
                            <button
                              type="button"
                              className="transactions__delete"
                              disabled
                              title="Exclusão de operações ainda não disponível"
                            >
                              Excluir operação
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        {operationId && (
          <Suspense
            fallback={
              <p role="status">Carregando visualização da operação...</p>
            }
          >
            <OperationDetails
              key={operationId}
              operationId={operationId}
              onClose={closeDetails}
            />
          </Suspense>
        )}
      </div>
      <button
        className="transactions__add"
        type="button"
        disabled
        aria-label="Adicionar movimentação — em breve"
        title="Cadastro manual ainda não disponível"
      >
        +
      </button>
    </section>
  );
}
