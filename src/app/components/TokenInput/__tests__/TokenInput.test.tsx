import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TokenInput from '../index'
import { parseEther } from 'viem'
describe('TokenInput', () => {
  const mockToken = {
    logoURI: '/icons/eth.png',
    name: 'Ether',
    symbol: 'ETH',
  }

  const mockBalance = {
    value: parseEther('1'),
    decimals: 18,
    symbol: 'ETH',
    formatted: '1.0',
  }

  const mockOnAmountChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with correct token information', () => {
    render(
      <TokenInput
        token={mockToken}
        amount=""
        onAmountChange={mockOnAmountChange}
        balance={mockBalance}
      />
    )

    expect(screen.getByText('1 ETH')).toBeInTheDocument()
  })

  it('calls onAmountChange when input value changes', () => {
    render(
      <TokenInput
        token={mockToken}
        amount=""
        onAmountChange={mockOnAmountChange}
        balance={mockBalance}
      />
    )

    const input = screen.getByPlaceholderText('0.0')
    fireEvent.change(input, { target: { value: '1.5' } })

    expect(mockOnAmountChange).toHaveBeenCalledWith('1.5')
  })

  it('sets max amount when clicking on balance with showMax enabled', () => {
    render(
      <TokenInput
        token={mockToken}
        amount=""
        onAmountChange={mockOnAmountChange}
        balance={mockBalance}
        showMax={true}
      />
    )

    const balanceText = screen.getByText('1 ETH')
    fireEvent.click(balanceText)

    expect(mockOnAmountChange).toHaveBeenCalledWith('1')
  })

  it('does not set max amount when showMax is disabled', () => {
    render(
      <TokenInput
        token={mockToken}
        amount=""
        onAmountChange={mockOnAmountChange}
        balance={mockBalance}
        showMax={false}
      />
    )

    const balanceText = screen.getByText('1 ETH')
    fireEvent.click(balanceText)

    expect(mockOnAmountChange).not.toHaveBeenCalled()
  })
}) 