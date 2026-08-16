/* eslint-disable import/no-unresolved */
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    id:string;
    email:string;
}|null;

type AuthContextType = {
    user:User;
    token:string|null;
    isLoading:boolean;
    login:(user: User, token: string) => Promise<void>;
    logout:() => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user:null,
    token:null,
    isLoading:true,
    login:async()=>{},
    logout:async()=>{},
});

export function AuthProvider({children}:{children:React.ReactNode}){
    const [user, setUser]= useState<User>(null);
    const [token, setToken]= useState<string|null>(null);
    const [isLoading, setIsLoading]= useState<boolean>(true);
    useEffect(()=>{
        async function loadStoredAuth(){
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            if(storedToken && storedUser){
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        }
        loadStoredAuth();
    },[]);

    async function login(newUser:User, newToken:string){
        setUser(newUser);
        setToken(newToken);
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
    }

    async function logout(){
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}
