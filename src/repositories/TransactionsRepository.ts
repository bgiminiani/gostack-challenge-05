import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce((inOut: any, actual) => {
      inOut[actual.type] = actual.value + inOut[actual.type] || actual.value;
      return inOut;
    }, {});

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (type === 'outcome' && value - balance.total > 0) {
      throw new Error('There is no money enough to outcome');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
