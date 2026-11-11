import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PageHeader } from './PageHeader';

afterEach(() => vi.useRealTimers());

describe('C8 — data do cabeçalho', () => {
  it('usa o dia atual em São Paulo sem confundir com atualização da cotação', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-10T01:00:00Z'));
    const { container } = render(
      <PageHeader
        isDarkTheme={false}
        isRefreshing={false}
        isSynchronizationEnabled={false}
        isSynchronizationUpdating={false}
        onRefresh={vi.fn()}
        onSynchronizationToggle={vi.fn()}
        onThemeToggle={vi.fn()}
      />,
    );
    expect(container.querySelector('time')?.textContent).toContain(
      '09 de nov. de 2026',
    );
    expect(screen.getByText(/não indica a data das cotações/)).toBeTruthy();
    expect(screen.queryByText(/12 JUN 2024/)).toBeNull();
  });
});
