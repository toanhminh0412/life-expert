import React, { useState } from 'react'
import {MdOutlineAddCircleOutline} from 'react-icons/md';
import {FiMinusCircle} from 'react-icons/fi';

function BudgetManager() {
    const [totalMoney, setTotalMoney] = useState(1000)
    const [incomeForm, setIncomeForm] = useState(true);
    const [expenseForm, setExpenseForm] = useState(false);
    
    return (
        <div className='pt-12 md:pt-16 lg:pl-40 lg:pt-4'>
            <h1 className='hidden'>Budget Manager</h1>
            <div className='text-center mt-8'>
                <h1 className='text-3xl xl:text-4xl font-bold'>You have ${1000} in your account</h1>
            </div>
            <div className='mt-4 xl:mt-8 flex flex-col xl:flex-row'>
                {incomeForm ? <IncomeForm/> : <IncomeButton/>}
                <ExpenseButton/>
            </div>
        </div>
    )
}

function IncomeButton () {
    return (
        <div className='shadow-md shadow-green-500 rounded-md w-11/12 xl:w-5/12 h-40 mx-auto flex flex-col justify-center hover:shadow-inner hover:border-2 hover:border-green-500 cursor-pointer'>
            <div className='text-center'>
                <MdOutlineAddCircleOutline className='mx-auto text-xl text-green-500'/>
                <p className='text-xl text-green-500'>Add income</p>
            </div>
        </div>
    )    
}

function ExpenseButton () {
    return (
        <div className='mt-4 xl:mt-0 shadow-md shadow-red-500 rounded-md w-11/12 xl:w-5/12 h-40 mx-auto flex flex-col justify-center hover:shadow-inner hover:border-2 hover:border-red-500 cursor-pointer'>
            <div className='text-center'>
                <FiMinusCircle className='mx-auto text-xl text-red-500'/>
                <p className='text-xl text-red-500'>Add expense</p>
            </div>
        </div>
    )  
}

function IncomeForm () {
    return (
        <form className='flex flex-col'>
            <input className='shadow-md' type='number' name='amount' placeholder='Amount'/>
            <select className='shadow-md' name='category' defaultValue="salary">
                <option value='salary'>Salary</option>
                <option value='business'>Business</option>
                <option value='passive-income'>Passive Income</option>
                <option value='others'>Others</option>
            </select>
            <input type='submit' value='Add'/>
        </form>
    )
}

export default BudgetManager
