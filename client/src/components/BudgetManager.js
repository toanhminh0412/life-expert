import React, { useState } from 'react'
import {MdOutlineAddCircleOutline} from 'react-icons/md';
import {FiMinusCircle} from 'react-icons/fi';

function BudgetManager() {
    const [totalMoney, setTotalMoney] = useState(1000)
    const [incomeForm, setIncomeForm] = useState(false);
    const [expenseForm, setExpenseForm] = useState(false);
    
    return (
        <div className='pt-12 md:pt-16 lg:pl-40 lg:pt-4'>
            <h1 className='hidden'>Budget Manager</h1>
            <div className='text-center mt-8'>
                <h1 className='text-3xl xl:text-4xl font-bold'>You have ${1000} in your account</h1>
            </div>
            <div className='mt-4 xl:mt-8 flex flex-col xl:flex-row'>
                {incomeForm ? <IncomeForm setButton={() => {setIncomeForm(false)}}/> : <IncomeButton setForm={() => {setIncomeForm(true)}}/>}
                {expenseForm ? <ExpenseForm setButton={() => {setExpenseForm(false)}}/> : <ExpenseButton setForm={() => {setExpenseForm(true)}}/>}
            </div>
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
        <form className='flex flex-col justify-center h-40 mt-4 mx-auto w-5/12'>
            <input className='shadow-md w-60 h-12 p-2 border mx-auto' type='number' name='amount' placeholder='Income Amount'/>
            <select className='shadow-md mt-4 w-60 h-12 p-2 border mx-auto' name='category' defaultValue="salary" placeholder='category'>
                <option value="" disabled selected>Category</option>
                <option value='salary'>Salary</option>
                <option value='business'>Business</option>
                <option value='passive-income'>Passive Income</option>
                <option value='others'>Others</option>
            </select>
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
        <form className='flex flex-col justify-center h-40 mt-4 mx-auto w-5/12'>
            <input className='shadow-md w-60 h-12 p-2 border mx-auto' type='number' name='amount' placeholder='Expense Amount'/>
            <select className='shadow-md mt-4 w-60 h-12 p-2 border mx-auto' name='category' defaultValue="salary" placeholder='category'>
                <option value="" disabled selected>Category</option>
                <option value='rent'>Rent</option>
                <option value='food'>Food</option>
                <option value='monthly-subscriptions'>Monthly subscriptions</option>
                <option value='services'>Services</option>
                <option value='necessities'>Necessities</option>
                <option value='others'>Others</option>
            </select>
            <div className='mx-auto flex flex-row mt-4'>
                <div onClick={props.setButton} className='mr-4 w-20 h-8 rounded-sm border bg-green-500 hover:bg-green-700 duration-200 shadow-md hover:shadow-inner text-md font-medium text-white cursor-default text-center'>
                    <p>Cancel</p>
                </div>
                <input className='w-20 h-8 rounded-sm border bg-red-500 hover:bg-red-700 duration-200 shadow-md hover:shadow-inner text-md font-medium text-white' type='submit' value='Add'/>
            </div>
        </form>
    )
}

export default BudgetManager
