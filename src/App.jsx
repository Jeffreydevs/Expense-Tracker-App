import { useState } from "react"

function App() {

 const [expenses, setExpenses] = useState([])
 const [name, setName] = useState("")
 const [amount, setAmount] = useState("")
 const [category, setCategory] = useState("")
 const [date, setDate] = useState("")

 function handleAddExpenses(){
    if (name === "" || amount === "" || category === "" || date === ""){
      alert("Please fill all fields")
      return
    }
    const newExpense = {
    id: Date.now(),
    name,
    amount,
    category,
    date
    }
    setExpenses([...expenses,newExpense])

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

  return(
   <>
      <div>
        <h1>Expense Tracker</h1>
      </div>
      <div>
        <input type="text" placeholder="Expense Name" value={name} onChange={(event)=> setName(event.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(event)=> setAmount(event.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(event)=> setCategory(event.target.value)} />
        <input type="date" value={date} onChange={(event)=> setDate(event.target.value)} />
        <button onClick={handleAddExpenses}>Add Expense</button>
      </div>
      <h2>Total Expenses: {expenses.length}</h2>
      <h2>Total Spent: ${totalSpent}</h2>
      
     {expenses.map((expense) => (
       <div key={expense.id}>
         <p>{expense.name}</p>
         <p>{expense.amount}</p>
         <p>{expense.category}</p>
         <p>{expense.date}</p>
         <button onClick={()=> handleDeleteExpenses(expense.id)}>Delete</button>
        </div>
      ))}
   </>
  )
}
export default App