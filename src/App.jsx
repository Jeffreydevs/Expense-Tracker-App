import { useEffect, useState } from "react"
import "./App.css"
import axios from "axios"
import Register from "./Register"
import Login from "./Login"

function App() {
  const token = localStorage.getItem("token");
  const [expenses, setExpenses] = useState([])
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [editId, setEditId] = useState(null)
  const [sortBy, setSortBy] = useState("default")

  async function fetchExpenses() {
   const token = localStorage.getItem("token");
   const res = await axios.get("http://localhost:3000/api/expenses", {
    headers: {Authorization: token}
   });
   setExpenses(res.data);
  }
  useEffect(() => { fetchExpenses() }, [])

  async function handleAddExpenses() {
    if (name === "" || amount === "" || category === "" || date === "") {
      alert("Please fill all fields")
      return
    }

   if (editId !== null) {
    await axios.put(`http://localhost:3000/api/expenses/${editId}`, {
      name, amount, category, date,
    },{ headers: {Authorization: localStorage.getItem("token")}}
    )

    fetchExpenses()

    setEditId(null)
    setName("")
    setAmount("")
    setCategory("")
    setDate("")

    return
   }

    await axios.post("http://localhost:3000/api/expenses", {
      name,amount,category,date, 
      }, { headers: { Authorization: localStorage.getItem("token") }}
    )
    fetchExpenses()
    
    setName("")
    setAmount("")
    setCategory("")
    setDate("")
  }

async function handleDeleteExpenses(id) {
  await axios.delete(`http://localhost:3000/api/expenses/${id}`, {
    headers: { Authorization: localStorage.getItem("token") }
  })
  fetchExpenses()
}

  const totalSpent = expenses.reduce((total, expense) => {
    return total + Number(expense.amount)
  }, 0)

  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length: 0;

  const highestExpense = expenses.length > 0
    ? Math.max(...expenses.map(expense => Number(expense.amount)))
    : 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthSpent = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);

  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch = expense.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "amountHigh") {
        return Number(b.amount) - Number(a.amount)
      }

      if (sortBy === "amountLow") {
        return Number(a.amount) - Number(b.amount)
      }

      if (sortBy === "newest") {
        return new Date(b.date) - new Date(a.date)
      }

      if (sortBy === "oldest") {
        return new Date(a.date) - new Date(b.date)
      }

      return 0
    })

  const categories = ["All", ...new Set(expenses.map((expense) => expense.category))]

  async function handleEditExpense(expense) {
    setName(expense.name)
    setAmount(expense.amount)
    setCategory(expense.category)
    setDate(expense.date)
    setEditId(expense._id)
  }

  if (!token) {
  return <Login />;
  }

  function handleLogout() {
  localStorage.removeItem("token");
  window.location.reload();
  }

  return (
    <>
    {/* <Login /> */}
    {/* <Register /> */}
    <button onClick={handleLogout}> Logout </button>
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Personal finance</p>
          <h1>SPENDIFI</h1>
          <p className="hero-copy">Track spending, filter by category, and keep your budget visible.</p>
        </div>

        <div className="summary-grid" aria-label="Expense summary">
          <article className="summary-card">
            <span>This Month</span>
            <strong>${thisMonthSpent.toFixed(2)}</strong>
          </article>
          <article className="summary-card highlight">
            <span>Total spent</span>
            <strong>${totalSpent.toFixed(2)}</strong>
          </article>
          <article className="summary-card">
            <span>Average Expense</span>
            <strong>${averageExpense.toFixed(2)}</strong>
          </article>

          <article className="summary-card">
            <span>Highest Expense</span>
            <strong>${highestExpense}</strong>
          </article>
        </div>
      </section>

      <section className="toolbar" aria-label="Search and sort expenses">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search expenses"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button className="secondary-button" onClick={() => setSearch(searchInput)}>
            Search
          </button>
        </div>

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort expenses">
          <option value="default">Default</option>
          <option value="amountHigh">Amount high to low</option>
          <option value="amountLow">Amount low to high</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </section>

      <section className="form-panel" aria-label="Add or edit expense">
        <input type="text" placeholder="Expense name" value={name} onChange={(event) => setName(event.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <button className="primary-button" onClick={handleAddExpenses}>
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </section>

      <section className="category-row" aria-label="Expense categories">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "category-chip active" : "category-chip"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="expense-list" aria-label="Expense list">
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses added yet</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="empty-state">No results found</p>
        ) : (
          filteredExpenses.map((expense) => (
            <article className="expense-card" key={expense._id}>
              <div className="expense-main">
                <p className="expense-name">{expense.name}</p>
                <p className="expense-meta">
                  {expense.category} / {expense.date}
                </p>
              </div>
              <p className="expense-amount">${Number(expense.amount).toFixed(2)}</p>
              <div className="expense-actions">
                <button className="ghost-button" onClick={() => handleEditExpense(expense)}>
                  Edit
                </button>
                <button className="danger-button" onClick={() => handleDeleteExpenses(expense._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
    </>
  )
}

export default App
