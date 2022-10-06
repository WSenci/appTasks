import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, ImageBackground, TextInput, Modal, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';

import AppLoading from 'expo-app-loading';
import { useFonts, Manrope_400Regular, Manrope_600SemiBold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';

export default function App() {

  const image = require('./resources/bg.jpg');

  const [tarefas, setarTarefas] = useState([
   
  ]);

  const [modal, setModal] = useState(false);

  const [tarefaAtual, setTarefaAtual] = useState('');

  let [fontsLoaded] = useFonts({ Manrope_400Regular, Manrope_600SemiBold, Manrope_800ExtraBold });

  useEffect(()=>{
    (async ()=> {
      try {
        let tarefasAtual = await AsyncStorage.getItem('tarefas');
        if(tarefasAtual == null)
        setarTarefas([]);
        else
        setarTarefas(JSON.parse(tarefasAtual));
      } catch (error) {

      }
    })();
  },[])

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function deletarTarefa(id) {
    let newTarefas = tarefas.filter(function (val) {
      return val.id != id;
    });

    setarTarefas(newTarefas);

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefas));
        console.log('chamado');
      } catch (error) {

      }
    })();

  }

  function addTarefa() {
    setModal(!modal);

    let id = 0;
    if(tarefas.length > 0){
      id = tarefas[tarefas.length - 1].id + 1;
    }
    let tarefa = {id: id, tarefa: tarefaAtual};
    setarTarefas([...tarefas,tarefa]);

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas,tarefa]));
      } catch (error) {

      }
    })();

  }

  return (
    <ScrollView style={{ flex: 1, }}>
      <StatusBar hidden />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={{maxWidth:120}} onChangeText={text => setTarefaAtual(text)} autoFocus={true}></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => addTarefa()}>
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{ marginTop: 10 }} onPress={() => {
              setModal(!modal);
            }}>
              <AntDesign name="closecircleo" size={18} color="black" />
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.textHeader}>Lista de Tarefas</Text>
      </ImageBackground>

      {
        tarefas.map(function (val) {
          return (
            <View style={styles.cadaTarefa}>
              <View style={{ flex: 1, width: '100%', padding: 10 }}>
                <Text style={{ fontFamily: 'Manrope_400Regular' }}>{val.tarefa}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1, padding: 10 }}>
                <TouchableOpacity onPress={() => deletarTarefa(val.id)}>
                  <AntDesign name="closecircleo" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      }
      <View style={{ left: '85%' }}>
        <TouchableOpacity onPress={() => setModal(true)} style={styles.novaTarefa}>
          <AntDesign name="pluscircleo" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  textHeader: {
    textAlign: 'center',
    marginTop: 23,
    color: 'black',
    fontSize: 20,
    fontFamily: 'Manrope_600SemiBold'
  },
  cadaTarefa: {
    marginTop: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  novaTarefa: {
    color: 'white',
    marginTop: 20,
    backgroundColor: 'black',
    height: 50,
    width: 50,
    borderRadius: 25,
    padding: 7,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 8,
  },
  //Estilos para nossa modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontFamily: "Manrope_800ExtraBold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});
