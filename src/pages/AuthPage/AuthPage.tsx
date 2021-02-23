import React, { useState, useContext, ChangeEvent, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { AuthContext } from '../../context/AuthContext'
import { useFetch } from '../../hooks/fetch.hook'
import './AuthPage.css'

interface IForm {
    email: string,
    name?: string,
    password: string
}

export const AuthPage: React.FC = () => {
    const [form, setForm] = useState<IForm>({
        email : '',
        name: '',
        password: ''
    })
    const [message, setMessage] = useState<string>('')
    const history = useHistory()
    const { login } = useContext(AuthContext)
    const { loading, fetchData } = useFetch()
    let timeout: number = window.setTimeout(() => {}, 0)
    
    useEffect(() => {
        timeout = window.setTimeout(() => {
            setMessage('')
        }, 3000)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [message])

    const clearInputs = (): void => {
        setForm({
            email: '',
            name: '',
            password: ''
        })
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        try {
            e.preventDefault()
            const { token, userId, name } = await fetchData('/api/auth/login', {}, 'POST', {email: form.email, password: form.password})
            login(token, userId, name)
            clearInputs()
            history.push('/')
        } catch (e) {
            setMessage(e)
        }
    }

    const registerHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        try {
            e.preventDefault()
            const data = await fetchData('/api/auth/register', {}, 'POST', {...form})
            setMessage(data.message)
            clearInputs()
        } catch (e) {
            setMessage(e)
        }
    }

    return (
        <div className="AuthPage">
            <Tabs defaultIndex={0} selectedTabClassName='selected'>
                <TabList>
                    <Tab>Войти</Tab>
                    <Tab>Зарегистрироваться</Tab>
                </TabList>

                <TabPanel>
                    <h2>Войдите в систему</h2>
                    <form onSubmit={loginHandler}>
                        <input 
                            type="email" 
                            name="email"
                            required
                            value={form.email} 
                            onChange={changeHandler} 
                            autoComplete="username" 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            required
                            value={form.password} 
                            onChange={changeHandler} 
                            autoComplete="current-password" 
                        />
                        <button type="submit" disabled={loading}>Войти</button>
                    </form>
                </TabPanel>

                <TabPanel>
                    <h2>Зарегистрируйтесь</h2>
                    <form onSubmit={registerHandler}>
                        <input 
                            type="email" 
                            name="email" 
                            required
                            value={form.email} 
                            onChange={changeHandler} 
                            autoComplete="username" 
                        />
                        <input 
                            type="text" 
                            name="name" 
                            required
                            value={form.name} 
                            onChange={changeHandler} 
                            autoComplete="name" 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            required
                            value={form.password} 
                            onChange={changeHandler} 
                            autoComplete="new-password" 
                        />
                        <button type="submit" disabled={loading}>Зарегистрироваться</button>                     
                    </form>
                </TabPanel>
            </Tabs>

            <p>{ message }</p>
        </div>
    )
}
