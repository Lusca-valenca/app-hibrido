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
 const screens={splash:Splash,login:Login};
 const Screen=screens[route.name]||(()=>null);
 return <SafeAreaView style={s.safe}><StatusBar style={route.name==='splash'?'light':'auto'}/><Screen {...props}/></SafeAreaView>;
}

function Splash(){return <View style={s.splash}><Logo light/><Text style={s.splashText}>A maior variedade de livros para você.</Text><ActivityIndicator size="large" color={colors.accent} style={{marginTop:45}}/></View>}
function Login({navigate}){const [email,setEmail]=useState(''),[pass,setPass]=useState(''),[error,setError]=useState('');const enter=()=>{if(!email.includes('@')||pass.length<4){setError('Informe um e-mail válido e uma senha com 4 caracteres.');return}navigate('home')};return <KeyboardAvoidingView style={s.page} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={s.login}><Logo/><Text style={s.title}>Bem-vindo de volta!</Text><Text style={s.muted}>Faça login para continuar</Text><View style={s.form}><TextInput style={s.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}/><TextInput style={s.input} placeholder="Senha" secureTextEntry value={pass} onChangeText={setPass}/>{error?<Text style={s.error}>{error}</Text>:null}<PrimaryButton title="ENTRAR" onPress={enter}/><Text style={s.or}>ou</Text><PrimaryButton title="CONTINUAR COMO VISITANTE" outline onPress={()=>navigate('home')}/><Text style={s.center}>Não tem conta? <Text style={s.link}>Criar conta</Text></Text></View></ScrollView></KeyboardAvoidingView>}
function Layout({children,current,navigate,cartCount}){return <View style={s.page}>{children}<BottomNav current={current} navigate={navigate} cartCount={cartCount}/></View>}

const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.primary},page:{flex:1,backgroundColor:colors.bg},splash:{flex:1,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},splashText:{color:'#fff',fontSize:16,marginTop:22},login:{flexGrow:1,backgroundColor:'#fff',padding:28,alignItems:'center',justifyContent:'center'},title:{fontSize:21,fontWeight:'800',color:colors.text,marginTop:30},muted:{color:colors.muted,marginTop:6},form:{width:'100%',gap:13,marginTop:28},input:{height:53,borderWidth:1,borderColor:colors.border,borderRadius:9,paddingHorizontal:15,backgroundColor:'#fff'},error:{color:colors.danger,fontSize:12},or:{textAlign:'center',color:colors.muted},center:{textAlign:'center',marginTop:18,color:colors.muted},link:{color:colors.primary,fontWeight:'700'}});

export default function App(){return <SafeAreaProvider><AppContent/></SafeAreaProvider>}