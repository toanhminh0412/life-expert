import React, {useState, useEffect} from 'react';
import {db} from '../App';
import { getDoc, doc} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';

function Budget() {
    const [income, setIncome] = useState({
        Business: [],
        Numbers: [],
        Others: [],
        "Passive Income": [],
        Salary: [],
    })
    const [expense, setExpense] = useState({
        Food: [],
        "Monthly Subscriptions": [],
        Necessities: [],
        Numbers: [],
        Others: [],
        Rent: [],
        Services: [],
    })
    const [totalMoney, setTotalMoney] = useState(0)
    const [viewOption, setViewOption] = useState('all-time')
    const navigate = useNavigate();

    // Get budget details from firestore
    const getBudget = async() => {
        // Construct budget Id
        let sessionId = window.localStorage.getItem('session');
        let userId = sessionId.split('-')[0];
        let budgetId = "budget-" + userId

        const budgetSnap = await getDoc(doc(db, "budgets", budgetId))
        if (budgetSnap.exists()) {
            const budgetData = budgetSnap.data()
            let incomeData = {
                Business: [],
                Numbers: [],
                Others: [],
                "Passive Income": [],
                Salary: [],
            }
            let expenseData = {
                Food: [],
                "Monthly Subscriptions": [],
                Necessities: [],
                Numbers: [],
                Others: [],
                Rent: [],
                Services: [],
            }
            // Show budget for all time
            if (viewOption === "all-time") {
                incomeData = budgetData.income;
                expenseData = budgetData.expense;

            // Show budget for today
            } else if (viewOption === "today") {
                let today = new Date();
                let date = today.getDate();
                let month = today.getMonth();
                let year = today.getFullYear();
                let begin_today = new Date(year, month, date, 0, 0, 0, 0).getTime();
                let end_today = begin_today + 60*60*24*1000;
                for (const key in budgetData.income) {
                    budgetData.income[key].forEach(item => {
                        if (item.created_at > begin_today && item.created_at < end_today) {
                            incomeData[key].push(item);
                        }
                    })
                }

                for (const key in budgetData.expense) {
                    budgetData.expense[key].forEach(item => {
                        if (item.created_at > begin_today && item.created_at < end_today) {
                            expenseData[key].push(item);
                        }
                    })
                }
            } else if (viewOption === "this-week") {
                let today = new Date();
                let date = today.getDate();
                let month = today.getMonth();
                let year = today.getFullYear();
                let day = today.getDay();
                let begin_today = new Date(year, month, date, 0, 0, 0, 0).getTime();
                let begin_week = begin_today - day*60*60*24*1000;
                let end_week = begin_week + 7*60*60*24*1000;
                for (const key in budgetData.income) {
                    budgetData.income[key].forEach(item => {
                        if (item.created_at > begin_week && item.created_at < end_week) {
                            incomeData[key].push(item);
                        }
                    })
                }

                for (const key in budgetData.expense) {
                    budgetData.expense[key].forEach(item => {
                        if (item.created_at > begin_week && item.created_at < end_week) {
                            expenseData[key].push(item);
                        }
                    })
                }
            } else if (viewOption === "this-month") {
                let today = new Date();
                let month = today.getMonth();
                let year = today.getFullYear();
                let day_num = new Date(year, month, 0).getDate();
                let begin_month = new Date(year, month, 1, 0, 0, 0, 0).getTime();
                let end_month = begin_month + day_num*60*60*24*1000;
                for (const key in budgetData.income) {
                    budgetData.income[key].forEach(item => {
                        if (item.created_at > begin_month && item.created_at < end_month) {
                            incomeData[key].push(item);
                        }
                    })
                }

                for (const key in budgetData.expense) {
                    budgetData.expense[key].forEach(item => {
                        if (item.created_at > begin_month && item.created_at < end_month) {
                            expenseData[key].push(item);
                        }
                    })
                }
            } else if (viewOption === "this-year") {
                let today = new Date();
                let year = today.getFullYear();
                let begin_year = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
                let end_year = new Date(year+1, 0, 1, 0, 0, 0, 0).getTime();
                for (const key in budgetData.income) {
                    budgetData.income[key].forEach(item => {
                        if (item.created_at > begin_year && item.created_at < end_year) {
                            incomeData[key].push(item);
                        }
                    })
                }

                for (const key in budgetData.expense) {
                    budgetData.expense[key].forEach(item => {
                        if (item.created_at > begin_year && item.created_at < end_year) {
                            expenseData[key].push(item);
                        }
                    })
                }
            }
            setIncome(incomeData)
            setExpense(expenseData)
            setTotalMoney(budgetData.totalMoney)
        }
    }

    useEffect(() => {
        getBudget();
    }, [viewOption])

    // Put date string in the right format
    const parseDateString = dateStr => {
        return dateStr.split(' ')[0].slice(0, -1);
    }

    // Sum all number in an array
    const sumAmount = arr => {
        let sum = 0;
        arr.forEach(item => sum = sum + item.amount)
        return sum
    }

    // change state of viewOption
    const changeViewOption = e => {
        setViewOption(e.target.value)
    }

    if (income && expense) {
        return (
            <div className='pt-12 md:pt-16 lg:pl-40 lg:pt-4 text-center pb-12'>
                <h1 className='mt-12 text-3xl xl:text-4xl font-bold'>You have ${totalMoney} in your account</h1>
                <div className='w-full mt-8 md:mt-12 flex flex-row'>
                    <select className='ml-12 p-2 font-lg border border-black rounded-sm' name='view-option' defaultValue='view-option' placeholder='View option' onChange={changeViewOption}>
                        <option value='view-option' disabled>View Option</option>
                        <option value='today'>Today</option>
                        <option value='this-week'>This week</option>
                        <option value='this-month'>This month</option>
                        <option value='this-year'>This year</option>
                        <option value='all-time'>All Time</option>
                    </select>
                    <div onClick={() => {navigate('/budget-manager/add')}} className='text-white rounded-sm bg-indigo-700 hover:bg-indigo-900 cursor-pointer py-1 px-5 w-fit h-fit ml-auto mr-8 md:mr-20 text-lg'>Edit</div>
                </div>
                <div className='text-center mt-12 flex flex-row flex-wrap'>
                    <div className='flex flex-col w-9/12 mx-auto xl:w-5/12 border border-2 border-green-500 p-2 h-fit'>
                        <h1 className='text-xl text-green-500 font-bold mb-2'>Salary (Income)</h1>
                        <div className='border-b border-green-500 border-2'></div>
                        {income.Salary.length === 0 ? <div className='mt-2'>No income recorded</div> : income.Salary.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-green-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(income.Salary)}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 xl:mt-0 border border-2 border-green-500 p-2 h-fit'>
                        <h1 className='text-xl text-green-500 font-bold mb-2'>Business (Income)</h1>
                        <div className='border-b border-green-500 border-2'></div>
                        {income.Business.length === 0 ? <div className='mt-2'>No income recorded</div> : income.Business.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-green-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(income.Business)}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-green-500 p-2 h-fit'>
                        <h1 className='text-xl text-green-500 font-bold mb-2'>Passive Income (Income)</h1>
                        <div className='border-b border-green-500 border-2'></div>
                        {income['Passive Income'].length === 0 ? <div className='mt-2'>No income recorded</div> : income['Passive Income'].map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-green-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(income['Passive Income'])}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-green-500 p-2 h-fit'>
                        <h1 className='text-xl text-green-500 font-bold mb-2'>Others (Income)</h1>
                        <div className='border-b border-green-500 border-2'></div>
                        {income.Others.length === 0 ? <div className='mt-2'>No income recorded</div> : income.Others.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-green-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(income.Others)}</div>
                        </div>
                    </div>
                    
                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-red-500 p-2 h-fit'>
                        <h1 className='text-xl text-red-500 font-bold mb-2'>Food (Expense)</h1>
                        <div className='border-b border-red-500 border-2'></div>
                        {expense.Food.length === 0 ? <div className='mt-2'>No expense recorded</div> : expense.Food.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-red-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(expense.Food)}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-red-500 p-2 h-fit'>
                        <h1 className='text-xl text-red-500 font-bold mb-2'>Monthly Subscriptions (Expense)</h1>
                        <div className='border-b border-red-500 border-2'></div>
                        {expense['Monthly Subscriptions'].length === 0 ? <div className='mt-2'>No expense recorded</div> : expense['Monthly Subscriptions'].map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-red-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(expense['Monthly Subscriptions'])}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-red-500 p-2 h-fit'>
                        <h1 className='text-xl text-red-500 font-bold mb-2'>Necessities (Expense)</h1>
                        <div className='border-b border-red-500 border-2'></div>
                        {expense.Necessities.length === 0 ? <div className='mt-2'>No expense recorded</div> : expense.Necessities.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-red-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(expense.Necessities)}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-red-500 p-2 h-fit'>
                        <h1 className='text-xl text-red-500 font-bold mb-2'>Rent (Expense)</h1>
                        <div className='border-b border-red-500 border-2'></div>
                        {expense.Rent.length === 0 ? <div className='mt-2'>No expense recorded</div> : expense.Rent.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-red-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(expense.Rent)}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-red-500 p-2 h-fit'>
                        <h1 className='text-xl text-red-500 font-bold mb-2'>Services (Expense)</h1>
                        <div className='border-b border-red-500 border-2'></div>
                        {expense.Services.length === 0 ? <div className='mt-2'>No expense recorded</div> : expense.Services.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-red-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(expense.Services)}</div>
                        </div>
                    </div>

                    <div className='flex flex-col w-9/12 mx-auto mt-12 xl:w-5/12 xl:ml-16 border border-2 border-red-500 p-2 h-fit'>
                        <h1 className='text-xl text-red-500 font-bold mb-2'>Others (Expense)</h1>
                        <div className='border-b border-red-500 border-2'></div>
                        {expense.Others.length === 0 ? <div className='mt-2'>No expense recorded</div> : expense.Others.map(item => 
                            (<div key={item.created_at} className='flex flex-row mt-2'>
                                <p className='text-center w-1/3'>{parseDateString(new Date(item.created_at).toLocaleString({day:"2-digit", month:'2-digits', year:'numeric'}))}</p>
                                <p className='text-center w-1/3'>{item.description}</p>
                                <p className='text-center w-1/3 text-md'>{item.amount}</p>
                            </div>)    
                        )}
                        <div className='border-b border-red-500 border-2 mt-2'></div>
                        <div className='flex flex-row justify-center mt-2'>
                            <div className='text-center w-1/3'>Total</div>
                            <div className='text-center w-1/3'></div>
                            <div className='text-center w-1/3 font-bold'>{sumAmount(expense.Others)}</div>
                        </div>
                    </div>

                </div>
            </div>
          )
    } else {
        return (
            <div className='pt-12 md:pt-16 lg:pl-40 lg:pt-4 text-center'>
                <h1 className='mt-12 text-3xl xl:text-4xl font-bold'>You have ${totalMoney} in your account</h1>
                <div onClick={() => {navigate('/budget-manager/add')}} className='text-white rounded-sm bg-indigo-700 hover:bg-indigo-900 cursor-pointer py-1 px-5 w-fit h-fit ml-auto mr-8 md:mr-20 lg:mr-32 xl:mr-64 mt-4 md:mt-12 text-lg'>Edit</div>
                <div className='text-center mt-12'>
                </div>
            </div>
          )
    }
  
}

export default Budget