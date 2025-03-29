import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Wrap from '../index'
import { TestWrapper } from '@/app/utils/test-utils'
import { parseEther } from 'viem'

// Mock the useWeth hook
vi.mock('@/app/hooks/useWeth', () => ({
  useWeth: () => ({
    wrapEth: vi.fn(),
    unwrapWeth: vi.fn(),
    isLoading: false,
    wethBalance: {
      value: parseEther('1'), // 1 WETH
      decimals: 18,
      symbol: 'WETH',
      formatted: '1.0',
    },
    ethBalance: {
      value: parseEther('1'), // 1 ETH
      decimals: 18,
      symbol: 'ETH',
      formatted: '1.0',
    },
  }),
}))

// Mock the useIsSafe hook
vi.mock('@/app/hooks/useIsSafe', () => ({
  default: () => ({
    isSafe: false,
  }),
  useIsSafe: () => ({
    isSafe: false,
  }),
}))

describe('Wrap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the wrap interface correctly', () => {
    render(
      <TestWrapper>
        <Wrap />
      </TestWrapper>
    )

    expect(screen.getByText('Wrap ETH')).toBeInTheDocument()
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('switches between wrap and unwrap modes', () => {
    render(
      <TestWrapper>
        <Wrap />
      </TestWrapper>
    )

    const swapButton = screen.getByRole('button', { name: /swap/i })
    fireEvent.click(swapButton)

    expect(screen.getByText('Unwrap WETH')).toBeInTheDocument()
  })

  it('disables action button when no amount is entered', () => {
    render(
      <TestWrapper>
        <Wrap />
      </TestWrapper>
    )

    const actionButton = screen.getByText('Connect Wallet')
    expect(actionButton).toBeDisabled()
  })
}) 