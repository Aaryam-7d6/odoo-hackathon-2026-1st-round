import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { Card, CardBody, Button, Input, Modal, Spinner, Select } from '../components/ui';
import { budgetApi, tripsApi } from '../api';
import { formatCurrency } from '../utils';
import { expenseCategories } from '../utils/constants';

const COLORS = ['#f59e0b', '#0f766e', '#10b981', '#ef4444', '#8b5cf6'];

export default function BudgetPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripId || null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBudget, setEditBudget] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'transport', amount: '', description: '', date: '' });
  const [budgetForm, setBudgetForm] = useState({});

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      loadBudget();
      loadExpenses();
    }
  }, [selectedTripId]);

  const loadTrips = async () => {
    try {
      const res = await tripsApi.list();
      setTrips(res.data);
      if (!selectedTripId && res.data.length > 0) {
        setSelectedTripId(res.data[0].id);
      }
    } catch { toast.error('Failed to load trips'); }
  };

  const loadBudget = async () => {
    if (!selectedTripId) return;
    try {
      const res = await budgetApi.get(selectedTripId);
      setBudget(res.data);
      setBudgetForm({
        transport_budget: res.data.transport_budget || 0,
        stay_budget: res.data.stay_budget || 0,
        activities_budget: res.data.activities_budget || 0,
        meals_budget: res.data.meals_budget || 0,
        misc_budget: res.data.misc_budget || 0,
        total_budget: res.data.total_budget || 0,
      });
    } catch { toast.error('Failed to load budget'); }
  };

  const loadExpenses = async () => {
    if (!selectedTripId) return;
    try {
      const res = await budgetApi.listExpenses(selectedTripId);
      setExpenses(res.data);
    } catch { toast.error('Failed to load expenses'); }
  };

  const saveBudget = async () => {
    try {
      const res = await budgetApi.update(selectedTripId, budgetForm);
      setBudget(res.data);
      setEditBudget(false);
      toast.success('Budget updated');
    } catch { toast.error('Failed to update budget'); }
  };

  const addExpense = async () => {
    if (!newExpense.amount) return;
    try {
      await budgetApi.addExpense(selectedTripId, newExpense);
      toast.success('Expense added');
      setShowAddModal(false);
      setNewExpense({ category: 'transport', amount: '', description: '', date: '' });
      loadExpenses();
      loadBudget();
    } catch { toast.error('Failed to add expense'); }
  };

  const getCategoryBreakdown = () => {
    if (!expenses.length) return [];
    const totals = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return expenseCategories.map((c, i) => ({
      name: c.label,
      value: totals[c.value] || 0,
      color: COLORS[i % COLORS.length],
    })).filter(c => c.value > 0);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetData = budgetForm ? [
    { name: 'Transport', budget: budgetForm.transport_budget, spent: expenses.filter(e => e.category === 'transport').reduce((s, e) => s + e.amount, 0) },
    { name: 'Stay', budget: budgetForm.stay_budget, spent: expenses.filter(e => e.category === 'stay').reduce((s, e) => s + e.amount, 0) },
    { name: 'Activities', budget: budgetForm.activities_budget, spent: expenses.filter(e => e.category === 'activity').reduce((s, e) => s + e.amount, 0) },
    { name: 'Meals', budget: budgetForm.meals_budget, spent: expenses.filter(e => e.category === 'meal').reduce((s, e) => s + e.amount, 0) },
    { name: 'Misc', budget: budgetForm.misc_budget, spent: expenses.filter(e => e.category === 'misc').reduce((s, e) => s + e.amount, 0) },
  ] : [];

  if (!tripId && trips.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-text-primary">Budget Tracker</h1>
        <div className="text-center py-12">
          <p className="text-text-secondary">Create a trip first to track your budget</p>
          <Button onClick={() => navigate('/trips/create')} className="mt-4">Create Trip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-text-primary">Budget Tracker</h1>
        {trips.length > 0 && !tripId && (
          <Select
            value={selectedTripId || ''}
            onChange={(e) => setSelectedTripId(Number(e.target.value))}
            options={trips.map(t => ({ value: t.id, label: t.name }))}
            className="sm:w-48"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-sm text-text-secondary">Total Budget</p>
          <p className="text-2xl font-display font-bold text-text-primary">{formatCurrency(budgetForm?.total_budget || 0)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-secondary">Total Spent</p>
          <p className="text-2xl font-display font-bold text-warning">{formatCurrency(totalSpent)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-text-secondary">Remaining</p>
          <p className={`text-2xl font-display font-bold ${(budgetForm?.total_budget - totalSpent) >= 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency((budgetForm?.total_budget || 0) - totalSpent)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-text-primary">Budget by Category</h2>
              <Button size="sm" variant="ghost" onClick={() => setEditBudget(!editBudget)}>
                {editBudget ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            {editBudget ? (
              <div className="space-y-3">
                {['transport_budget', 'stay_budget', 'activities_budget', 'meals_budget', 'misc_budget'].map((field) => (
                  <Input
                    key={field}
                    label={field.replace('_budget', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    type="number"
                    min="0"
                    value={budgetForm[field]}
                    onChange={(e) => setBudgetForm({ ...budgetForm, [field]: parseFloat(e.target.value) || 0 })}
                  />
                ))}
                <Input
                  label="Total Budget"
                  type="number"
                  min="0"
                  value={budgetForm.total_budget}
                  onChange={(e) => setBudgetForm({ ...budgetForm, total_budget: parseFloat(e.target.value) || 0 })}
                />
                <Button onClick={saveBudget} className="w-full">Save Budget</Button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budgetData}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="budget" fill="#0f766e" name="Budget" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="#f59e0b" name="Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-text-primary">Spending Breakdown</h2>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                Add Expense
              </Button>
            </div>
            {getCategoryBreakdown().length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={getCategoryBreakdown()} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {getCategoryBreakdown().map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-text-secondary">No expenses yet</div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h2 className="text-lg font-display font-bold text-text-primary mb-4">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-text-secondary text-center py-8">No expenses recorded yet</p>
          ) : (
            <div className="space-y-2">
              {expenses.slice().reverse().map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
                  <div>
                    <p className="font-medium text-text-primary">{exp.description || expenseCategories.find(c => c.value === exp.category)?.label}</p>
                    <p className="text-sm text-text-secondary">{exp.date} • {exp.category}</p>
                  </div>
                  <p className="font-semibold text-text-primary">{formatCurrency(exp.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense" size="sm">
        <div className="space-y-4">
          <Select
            label="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            options={expenseCategories}
          />
          <Input
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            error={!newExpense.amount ? 'Amount is required' : ''}
          />
          <Input
            label="Description"
            placeholder="What was this expense for?"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          />
          <Button onClick={addExpense} className="w-full" disabled={!newExpense.amount}>
            Add Expense
          </Button>
        </div>
      </Modal>
    </div>
  );
}
