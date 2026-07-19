import { useState } from 'react';

// DATA INTERFACE
export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: string;
}
// 1. EXPENSEITEM COMPONENT
interface ExpenseItemProps {
  item: Expense;
  onDelete: (id: string) => void;
  isHighest: boolean;
}

function ExpenseItem({ item, onDelete, isHighest }: ExpenseItemProps) {
  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem',
        borderBottom: '1px solid #eee',
        backgroundColor: isHighest ? '#ffebee' : 'transparent',
        transition: 'background-color 0.2s ease'
      }}
    >
      <div>
        <span style={{ fontWeight: 500 }}>{item.label}</span>
        <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.5rem' }}>
          ({item.category})
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: isHighest ? '#d32f2f' : '#000', fontWeight: isHighest ? 'bold' : 'normal' }}>
          ${item.amount.toFixed(2)}
        </span>
        <button 
          onClick={() => onDelete(item.id)} 
          style={{ 
            background: '#ff5252', 
            color: 'white', 
            border: 'none', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '3px', 
            cursor: 'pointer' 
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

// 2. EXPENSELIST COMPONENT
interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  maxAmount: number;
}

function ExpenseList({ expenses, onDelete, maxAmount }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
        No expenses trackable under this criteria.
      </p>
    );
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1.5rem' }}>
      {expenses.map((item) => (
        <ExpenseItem 
          key={item.id} // Passing unique key as required
          item={item} 
          onDelete={onDelete} 
          isHighest={item.amount === maxAmount && maxAmount > 0}
        />
      ))}
    </ul>
  );
}

// 3. EXPENSEFORM COMPONENT
interface ExpenseFormProps {
  onAdd: (label: string, amount: number, category: string) => void;
}

function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !amount) return;

    onAdd(label, parseFloat(amount), category); // Event flows UP to parent
    setLabel('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Expense Label (e.g., Coffee)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '100px', padding: '0.5rem' }}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '0.5rem' }}>
        <option value="Food">Food</option>
        <option value="Utilities">Utilities</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Add</button>
    </form>
  );
}

// 4. SUMMARYBAR COMPONENT
function SummaryBar({ total }: { total: number }) {
  return (
    <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px', fontWeight: 'bold' }}>
      Live Total: ${total.toFixed(2)}
    </div>
  );
}

// 5. MAIN APP COMPONENT
function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const addExpense = (label: string, amount: number, category: string) => {
    setExpenses((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        label,
        amount,
        category,
      },
    ]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredExpenses = expenses.filter((expense) => {
    return filterCategory === 'All' ? true : expense.category === filterCategory;
  });

  // Source of Truth calculation: derived total from state
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const maxExpenseAmount = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

  return (
    <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h2>Personal Expense Tracker</h2>
      
      {/* State actions passed down via callbacks */}
      <ExpenseForm onAdd={addExpense} />
      
      <div style={{ margin: '1rem 0' }}>
        <label htmlFor="category-filter">Filter by Category: </label>
        <select 
          id="category-filter" 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Receives total value directly via props */}
      <SummaryBar total={total} />

      {/* Receives item arrays via props */}
      <ExpenseList 
        expenses={filteredExpenses} 
        onDelete={deleteExpense} 
        maxAmount={maxExpenseAmount}
      />
    </main>
  );
}

export default App;