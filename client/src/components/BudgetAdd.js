import React, { useState, useEffect } from 'react'
import {MdOutlineAddCircleOutline} from 'react-icons/md';
import {FiMinusCircle} from 'react-icons/fi';
import {db} from '../App';
import { getDoc, doc, deleteDoc, setDoc} from 'firebase/firestore';
import {useNavigate} from "react-router-dom";

function BudgetAdd() {
    const [totalMoney, setTotalMoney] = useState(0)
    const [incomeForm, setIncomeForm] = useState(false);
    const [expenseForm, setExpenseForm] = useState(false);
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [incomeCategory, setIncomeCategory] = useState('')
    const [incomeDescription, setIncomeDescription] = useState('None');
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseCategory, setExpenseCategory] = useState('')
    const [expenseDescription, setExpenseDescription] = useState('None');
    const [successMsg, setSuccessMsg] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const [budget, setBudget] = useState(null)

    // Get budget details from firestore
    const getBudget = async() => {
        // Construct budget Id
        let sessionId = window.localStorage.getItem('session');
        let userId = sessionId.split('-')[0];
        let budgetId = "budget-" + userId

        const budgetSnap = await getDoc(doc(db, "budgets", budgetId))
        if (budgetSnap.exists()) {
            const budgetData = budgetSnap.data()
            setBudget(budgetData)
            setTotalMoney(budgetData.totalMoney)
        }
    }
    
    // Check session and update budgets every time the page render
    useEffect(() => {

        function getDifferenceInDays(date1, date2) {
            const diffInMs = Math.abs(date2 - date1);
            return diffInMs / (1000 * 60 * 60 * 24);
          }
        
        // get session from firestore database, log out if session is over 24 hours
        const checkSession = async () => {
            const currentSession = window.localStorage.getItem('session')
            if (currentSession === "") {
                navigate('/login')
            }
            else {
                const sessionSnap = await getDoc(doc(db, "sessions", currentSession));
            if (!sessionSnap.exists()) {
                window.localStorage.setItem('session', '')
                navigate('/login')
            } else {
                const created_int = sessionSnap.data().created_at
                const created_date = new Date(created_int)
                const current_date = Date.now()
                const day_diff = getDifferenceInDays(created_date, current_date)
                if (day_diff >= 1) {
                    await deleteDoc(doc(db, "sessions", currentSession))
                    window.localStorage.setItem("session", "");
                    navigate('/login')
                } 
            }
            } 
        }

        checkSession();
        getBudget();
    }, [])

    const changeIncomeAmount = e => {
        setIncomeAmount(e.target.value);
    }

    const changeIncomeCategory = e => {
        setIncomeCategory(e.target.value);
    }

    const changeIncomeDescription = e => {
        setIncomeDescription(e.target.value)
    }

    const changeExpenseAmount = e => {
        setExpenseAmount(e.target.value);
    }

    const changeExpenseCategory = e => {
        setExpenseCategory(e.target.value);
    }

    const changeExpenseDescription = e => {
        setExpenseDescription(e.target.value)
    }

    // add an income
    const addIncome = async(e) => {
        e.preventDefault();
        if (incomeCategory === "") {
            setError('Please set your income category')
            setSuccessMsg('')
        } 
        else if (incomeAmount === 0) {
            setError('Income amount has to be larger than 0')
            setSuccessMsg('')
        } else {
            let newIncome = {
                "amount": parseInt(incomeAmount),
                "description": incomeDescription,
                "created_at": Date.now()
            }

            // Read current budget from database
            let sessionId = window.localStorage.getItem('session');
            let userId = sessionId.split('-')[0];
            let budgetId = "budget-" + userId
            const budgetSnap = await getDoc(doc(db, 'budgets', budgetId));
            let updatedBudget = {}
            if (budgetSnap.exists()) {
                updatedBudget = budgetSnap.data();
                updatedBudget.income[incomeCategory].push(newIncome);
                updatedBudget.income.Numbers.push(parseInt(incomeAmount));
            } else {
                updatedBudget={
                    "totalMoney": 0,
                    "income": {
                        "Numbers": [],
                        "Salary": [],
                        "Business": [],
                        "Passive Income": [],
                        "Others": []
                    },
                    "expense": {
                        "Numbers": [],
                        "Rent": [],
                        "Food": [],
                        "Monthly Subscriptions": [],
                        "Services": [],
                        "Necessities": [],
                        "Others": []
                    }
                }
                updatedBudget["income"][incomeCategory].push(newIncome);
                updatedBudget["income"]["Numbers"].push(parseInt(incomeAmount));
            }

            // Calculate new total
            let budgetTotal = 0
            updatedBudget["income"]["Numbers"].forEach(number => {
                budgetTotal = budgetTotal + number
            });
            updatedBudget["expense"]["Numbers"].forEach(number => {
                budgetTotal = budgetTotal - number
            })

            updatedBudget['totalMoney'] = budgetTotal;

            // Write new budget to database
            await setDoc(doc(db, 'budgets', budgetId), updatedBudget);
            getBudget();
            setSuccessMsg('Add Income successfully')
            setError('')
            setIncomeForm(false)
            setIncomeAmount(0)
            setIncomeCategory('')
            setIncomeDescription('')
            navigate('/budget-manager');
        }
    }

    // add an expense
    const addExpense = async(e) => {
        e.preventDefault();
        if (expenseCategory === "") {
            setError('Please set your expense category')
            setSuccessMsg('')
        } 
        else if (expenseAmount === 0) {
            setError('Expense amount has to be larger than 0')
            setSuccessMsg('')
        } else {
            let newExpense = {
                "amount": parseInt(expenseAmount),
                "description": expenseDescription,
                "created_at": Date.now()
            }

            // Read current budget from database
            let sessionId = window.localStorage.getItem('session');
            let userId = sessionId.split('-')[0];
            let budgetId = "budget-" + userId
            const budgetSnap = await getDoc(doc(db, 'budgets', budgetId));
            let updatedBudget = {}
            if (budgetSnap.exists()) {
                updatedBudget = budgetSnap.data();
                updatedBudget.expense[expenseCategory].push(newExpense);
                updatedBudget.expense.Numbers.push(parseInt(expenseAmount));
            } else {
                updatedBudget={
                    "totalMoney": 0,
                    "income": {
                        "Numbers": [],
                        "Salary": [],
                        "Business": [],
                        "Passive Income": [],
                        "Others": []
                    },
                    "expense": {
                        "Numbers": [],
                        "Rent": [],
                        "Food": [],
                        "Monthly Subscriptions": [],
                        "Services": [],
                        "Necessities": [],
                        "Others": []
                    }
                }
                updatedBudget["expense"][expenseCategory].push(newExpense);
                updatedBudget["expense"]["Numbers"].push(parseInt(expenseAmount));
            }

            // Calculate new total
            let budgetTotal = 0
            updatedBudget["income"]["Numbers"].forEach(number => {
                budgetTotal = budgetTotal + number
            });
            updatedBudget["expense"]["Numbers"].forEach(number => {
                budgetTotal = budgetTotal - number
            })
            updatedBudget['totalMoney'] = budgetTotal;

            // Write new budget to database
            await setDoc(doc(db, 'budgets', budgetId), updatedBudget);
            getBudget();
            setSuccessMsg('Add Expense successfully')
            setError('')
            setExpenseForm(false)
            setExpenseAmount(0)
            setExpenseCategory('')
            setExpenseDescription('')
            navigate('/budget-manager');
        }
    }
    
    return (
        <div className='pt-12 md:pt-16 lg:pl-40 lg:pt-4'>
            <h1 className='hidden'>Budget Manager</h1>
            <div className='text-center mt-8'>
                <h1 className='text-3xl xl:text-4xl font-bold'>You have ${totalMoney} in your account</h1>
                {error===""? (<div></div>):<p className='border border-red-500 bg-red-100 font-lg text-red-600 rounded-sm px-4 md:px-8 py-2 text-center w-fit mx-auto mt-6 mb-6'>{error}</p>}
                {successMsg===""? (<div></div>):<p className='border border-green-500 bg-green-100 font-lg text-green-600 rounded-sm px-4 md:px-8 py-2 text-center w-fit mx-auto mt-6 mb-6'>{successMsg}</p>}
            </div>
            <div className='mt-4 xl:mt-8 flex flex-col xl:flex-row'>
                {incomeForm ? <IncomeForm setButton={() => {setIncomeForm(false)}} changeIncomeAmount={changeIncomeAmount} changeIncomeCategory={changeIncomeCategory} changeIncomeDescription={changeIncomeDescription} addIncome={addIncome}/> : <IncomeButton setForm={() => {setIncomeForm(true)}}/>}
                {expenseForm ? <ExpenseForm setButton={() => {setExpenseForm(false)}} changeExpenseAmount={changeExpenseAmount} changeExpenseCategory={changeExpenseCategory} changeExpenseDescription={changeExpenseDescription} addExpense={addExpense}/> : <ExpenseButton setForm={() => {setExpenseForm(true)}} />}
            </div>
            <div onClick={() => {navigate('/budget-manager')}} className='text-white rounded-sm bg-red-700 hover:bg-red-900 cursor-pointer py-1 px-5 w-fit h-fit ml-auto mr-10 xl:mr-16 mt-12 md:mt-20 text-lg'>Cancel</div>
        </div>
    )
}

function IncomeButton (props) {
    return (
        <div onClick={props.setForm} className='shadow-md shadow-green-500 rounded-md w-11/12 xl:w-5/12 h-40 mx-auto flex flex-col justify-center hover:shadow-inner hover:border-2 hover:border-green-500 cursor-pointer'>
            <div className='text-center'>
                <MdOutlineAddCircleOutline className='mx-auto text-xl text-green-500'/>
                <p className='text-xl text-green-500'>Add income</p>
            </div>
        </div>
    )    
}

function ExpenseButton (props) {
    return (
        <div onClick={props.setForm} className='mt-4 xl:mt-0 shadow-md shadow-red-500 rounded-md w-11/12 xl:w-5/12 h-40 mx-auto flex flex-col justify-center hover:shadow-inner hover:border-2 hover:border-red-500 cursor-pointer'>
            <div className='text-center'>
                <FiMinusCircle className='mx-auto text-xl text-red-500'/>
                <p className='text-xl text-red-500'>Add expense</p>
            </div>
        </div>
    )  
}

function IncomeForm (props) {
    return (
        <form className='text-center flex flex-col justify-center h-fit mt-4 mx-auto w-5/12' onSubmit={props.addIncome}>
            <input className='shadow-md w-60 h-12 p-2 border mx-auto' type='number' name='amount' placeholder='Income Amount' onChange={props.changeIncomeAmount}/>
            <select className='shadow-md mt-4 w-60 h-12 p-2 border mx-auto' name='category' defaultValue="" placeholder='category' onChange={props.changeIncomeCategory}>
                <option value="" disabled>Category</option>
                <option value='Salary'>Salary</option>
                <option value='Business'>Business</option>
                <option value='Passive Income'>Passive Income</option>
                <option value='Others'>Others</option>
            </select>
            <input type='text' className='mt-4 shadow-md w-60 h-12 p-2 border mx-auto' name='description' placeholder='Description' onChange={props.changeIncomeDescription}/>
            <div className='mx-auto flex flex-row mt-4'>
                <div onClick={props.setButton} className='mr-4 w-20 h-8 rounded-sm border bg-red-500 hover:bg-red-700 duration-200 shadow-md hover:shadow-inner text-lg font-medium text-white cursor-default text-center'>
                    <p>Cancel</p>
                </div>
                <input className='w-20 h-8 rounded-sm border bg-green-500 hover:bg-green-700 duration-200 shadow-md hover:shadow-inner text-md font-medium text-white' type='submit' value='Add'/>
            </div>
        </form>
    )
}

function ExpenseForm(props) {
    return (
        <form className='flex flex-col justify-center h-fit mt-12 xl:mt-4 mx-auto w-5/12' onSubmit={props.addExpense}>
            <input className='shadow-md w-60 h-12 p-2 border mx-auto' type='number' name='amount' placeholder='Expense Amount' onChange={props.changeExpenseAmount}/>
            <select className='shadow-md mt-4 w-60 h-12 p-2 border mx-auto' name='category' defaultValue="" placeholder='category' onChange={props.changeExpenseCategory}>
                <option value="" disabled>Category</option>
                <option value='Rent'>Rent</option>
                <option value='Food'>Food</option>
                <option value='Monthly Subscriptions'>Monthly subscriptions</option>
                <option value='Services'>Services</option>
                <option value='Necessities'>Necessities</option>
                <option value='Others'>Others</option>
            </select>
            <input type='text' className='mt-4 shadow-md w-60 h-12 p-2 border mx-auto' name='description' placeholder='Description' onChange={props.changeExpenseDescription}/>
            <div className='mx-auto flex flex-row mt-4'>
                <div onClick={props.setButton} className='mr-4 w-20 h-8 rounded-sm border bg-green-500 hover:bg-green-700 duration-200 shadow-md hover:shadow-inner text-md font-medium text-white cursor-default text-center'>
                    <p>Cancel</p>
                </div>
                <input className='w-20 h-8 rounded-sm border bg-red-500 hover:bg-red-700 duration-200 shadow-md hover:shadow-inner text-md font-medium text-white' type='submit' value='Add'/>
            </div>
        </form>
    )
}

export default BudgetAdd
