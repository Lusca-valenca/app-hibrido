import React,{useEffect,useMemo,useState} from 'react';
import {SafeAreaView,View,Text,TextInput,ScrollView,Pressable,StyleSheet,ActivityIndicator,Alert,KeyboardAvoidingView,Platform} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {colors,shadow} from './src/theme';
import {books,categories} from './src/data';
import {Logo,Cover,Stars,Header,PrimaryButton,BottomNav,Empty} from './src/components/UI';

const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

function AppContent(){
 const [route,setRoute]=useState({name:'splash'}),[cart,setCart]=useState({}),[favorites,setFavorites]=useState([]),[query,setQuery]=useState('');
 useEffect(()=>{if(route.name==='splash'){const t=setTimeout(()=>setRoute({name:'login'}),1500);return()=>clearTimeout(t)}},[route.name]);
 const navigate=(name,params={})=>setRoute({name,...params});
 const add=id=>{setCart(c=>({...c,[id]:(c[id]||0)+1}));Alert.alert('Adicionado','Livro incluído no carrinho.')};
 const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
 const toggleFav=id=>setFavorites(x=>x.includes(id)?x.filter(v=>v!==id):[...x,id]);
 const props={navigate,route,cart,setCart,cartCount,favorites,toggleFav,add,query,setQuery};
 const screens={};
 const Screen=screens[route.name]||(()=>null);
 return <SafeAreaView style={s.safe}><StatusBar style={route.name==='splash'?'light':'auto'}/><Screen {...props}/></SafeAreaView>;
}

const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.primary}});

export default function App(){return <SafeAreaProvider><AppContent/></SafeAreaProvider>}