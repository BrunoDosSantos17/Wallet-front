import { useEffect, useRef, useState } from 'react';
import { importWalletTransactions } from '../../api/wallet';
import type { ImportResponse } from '../../types/portfolio';
import { ImportTransactionsSkeleton } from './ImportTransactionsSkeleton';
import './ImportTransactions.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['xlsx', 'xls'];

interface ImportTransactionsProps {
  walletId: number;
  walletName: string;
  onComplete: () => void;
}

function isAcceptedFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension !== undefined && ACCEPTED_EXTENSIONS.includes(extension);
}

export function ImportTransactions({
  walletId,
  walletName,
  onComplete,
}: ImportTransactionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  function selectFile(nextFile: File | undefined) {
    if (!nextFile) {
      return;
    }

    setError(null);
    setResult(null);

    if (!isAcceptedFile(nextFile)) {
      setFile(null);
      setError('Selecione uma planilha XLS ou XLSX.');
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError('O arquivo deve ter no máximo 10 MB.');
      return;
    }

    setFile(nextFile);
  }

  async function handleImport() {
    if (!file) {
      setError('Selecione um arquivo antes de importar.');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const response = await importWalletTransactions(walletId, file);
      setResult(response);
      onComplete();
    } catch {
      setError('Não foi possível importar o arquivo. Tente novamente.');
    } finally {
      setIsImporting(false);
    }
  }

  if (isImporting) {
    return <ImportTransactionsSkeleton />;
  }

  return (
    <section className="import-transactions" aria-labelledby="import-title">
      <header className="import-transactions__heading">
        <span>MOVIMENTAÇÕES / IMPORTAR</span>
        <h1 id="import-title">Importe suas movimentações</h1>
        <p>Envie uma planilha e mantenha sua carteira sempre atualizada.</p>
        <p>Carteira de destino: <strong>{walletName}</strong> (ID {walletId})</p>
      </header>

      <input
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="import-transactions__input"
        onChange={event => selectFile(event.target.files?.[0])}
        ref={fileInputRef}
        type="file"
      />
      <div
        className={`import-transactions__dropzone ${isDragging ? 'import-transactions__dropzone--dragging' : ''}`}
        onDragEnter={event => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={event => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={event => event.preventDefault()}
        onDrop={event => {
          event.preventDefault();
          setIsDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }}
      >
        <span className="import-transactions__upload-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 16V3M7 8l5-5 5 5M5 21h14" />
          </svg>
        </span>
        <h2>{file ? file.name : 'Solte o arquivo aqui'}</h2>
        <p>
          {file
            ? `${(file.size / 1024 / 1024).toFixed(2)} MB · pronto para importar`
            : 'ou selecione no seu computador · XLS ou XLSX até 10 MB'}
        </p>
        <div className="import-transactions__actions">
          <button onClick={() => fileInputRef.current?.click()} type="button">
            Selecionar arquivo
          </button>
          {file && (
            <button
              className="import-transactions__submit"
              onClick={() => void handleImport()}
              type="button"
            >
              Importar movimentações
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="import-transactions__message import-transactions__message--error">
          {error}
        </p>
      )}

      {result && (
        <section
          aria-live="polite"
          className="import-transactions__result"
          ref={resultRef}
        >
          <h2>Importação concluída</h2>
          <div>
            <strong>{result.successCount}</strong>
            <span>movimentações importadas de {result.totalRows} linhas</span>
          </div>
          {result.errorCount > 0 && (
            <ul className="import-transactions__error-list">
              {result.errors.map(item => (
                <li key={`${item.rowNumber}-${item.message}`}>
                  Linha {item.rowNumber}: {item.message}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="import-transactions__guidance">
        <span aria-hidden="true">✓</span>
        <div>
          <strong>Seus dados ficam protegidos</strong>
          <p>
            Utilize uma planilha com data, tipo, ticker, quantidade e preço.
          </p>
        </div>
      </section>
    </section>
  );
}
