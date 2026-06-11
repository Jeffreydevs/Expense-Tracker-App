import { useEffect, useState } from "react"

function App() {

 const [expenses, setExpenses] = useState(() => { const savedExpenses = localStorage.getItem("expenses") 
  return savedExpenses ? JSON.parse(savedExpenses) : [] })
 const [name, setName] = useState("")
 const [amount, setAmount] = useState("")
 const [category, setCategory] = useState("")
 const [date, setDate] = useState("")
 const [search, setSearch] = useState("")
 const [searchInput,setSearchInput] = useState("")
 const [selectedCategory, setSelectedCategory] = useState("All")
 const [editId, setEditId] = useState(null)
 const [sortBy, setSortBy] = useState("default")

 function handleAddExpenses() {
  if (name === "" || amount === "" || category === "" || date === "") {
    alert("Please fill all fields")
    return
  }

  if (editId !== null) {const updatedExpenses = expenses.map((expense) =>expense.id === editId ? 
    {
      ...expense,
      name,
      amount,
      category,
      date,
    }
    : expense
    )

    setExpenses(updatedExpenses)

    setEditId(null)
    setName("")
    setAmount("")
    setCategory("")
    setDate("")

    return
  }

  const newExpense = {
    id: Date.now(),
    name,
    amount,
    category,
    date,
  }

  setExpenses([...expenses, newExpense])

  setName("")
  setAmount("")
  setCategory("")
  setDate("")
}
  function handleDeleteExpenses(id){
    const updatedExpenses = expenses.filter((expense) => expense.id !== id )
    setExpenses(updatedExpenses)
  }
  const totalSpent = expenses.reduce((total,expense)=> {return total + Number(expense.amount)},0)

  useEffect(() => {
  localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

 const filteredExpenses = expenses.filter((expense) => {const matchesSearch = expense.name.toLowerCase().includes(search.toLowerCase())
  const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory 
  return matchesSearch && matchesCategory})
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

 const categories = [ "All",...new Set(expenses.map((expense) => expense.category))]

 function handleEditExpense(expense) {
  setName(expense.name)
  setAmount(expense.amount)
  setCategory(expense.category)
  setDate(expense.date)

  setEditId(expense.id)
 }

  return(
   <>
      <div>
        <h1>Expense Tracker</h1>
      </div>
      <div>
        <input type="text" placeholder="search.." value={searchInput} onChange={(event)=> setSearchInput(event.target.value)}/>
        <button onClick={()=> setSearch(searchInput)}>SEARCH</button>
      </div>
      <div>
        <input type="text" placeholder="Expense Name" value={name} onChange={(event)=> setName(event.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(event)=> setAmount(event.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(event)=> setCategory(event.target.value)} />
        <input type="date" value={date} onChange={(event)=> setDate(event.target.value)} />
        <button onClick={handleAddExpenses}>{editId ? "Update Expense" : "Add Expense"}</button>
      </div>
      <div>{categories.map((category) => (<button key={category} onClick={() => setSelectedCategory(category)}>{category}</button>))} </div>
      <select
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value="default">Default</option>
        <option value="amountHigh">Amount High → Low</option>
        <option value="amountLow">Amount Low → High</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        </select>
      <h2>Total Expenses: {expenses.length}</h2>
      <h2>Total Spent: ${totalSpent}</h2>
      
     {expenses.length === 0 ?(<p>No expenses added yet</p>):
     filteredExpenses.length === 0 ?(<p>No results found</p>):
     (filteredExpenses.map((expense) => (
       <div key={expense.id}>
         <p>{expense.name}</p>
         <p>{expense.amount}</p>
         <p>{expense.category}</p>
         <p>{expense.date}</p>
         <button onClick={() => handleEditExpense(expense)}> Edit </button>
         <button onClick={()=> handleDeleteExpenses(expense.id)}>Delete</button>
        </div>
      )))}
   </>
  )
}
export default App