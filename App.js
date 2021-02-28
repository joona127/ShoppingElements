import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { Header, Input, Button, Icon, ListItem } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppingdb.db');

export default function App() {
  const [product, setProduct] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [shopping, setShopping] = React.useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, product text, amount text);');
    });
    updateList();    
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shopping (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping;', [], (_, { rows }) =>
        setShopping(rows._array)
      ); 
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };


  const Clear = () => {
    setShopping([]);

  }
  
  return (

    

    <View style={styles.container}>
     
      <View style={styles.header}>
      <Header 
    centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
    />
    </View>
      
      <Input placeholder='Type a product'
      label='Product'
      //  style={styles.TextInputStyle}

        keyboardType={'default'}

        onChangeText={(product) => setProduct(product)}
        value={product}

      />
      <Input placeholder='How much?'
      label='Amount'
      //  style={styles.TextInputStyle}

        keyboardType={'default'}

        onChangeText={(amount) => setAmount(amount)}
        value={amount}

      />

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button raised icon={{name: "add", color: 'white'}} title="ADD" onPress={saveItem} />
        </View>
        <View style={styles.clearbutton}>
          <Button raised icon={{name: "clear", color: 'white'}} title="CLEAR ALL" onPress={Clear} />
        </View>
      </View>
      <Text style={styles.text}>Shopping List</Text>
    
     
      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.textContainer}><Text>{item.product}, {item.amount}</Text>
          <Text style={{fontSize: 14, color: '#0000ff', paddingLeft: 15}} onPress={() => deleteItem(item.id)}> Bought</Text></View>}
          data={shopping}
          ItemDeparatorComponent={listSeparator}
      />
        
      
        </View>
        
        
        
  
  );
  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  TextInputStyle: {
    textAlign: 'center',
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingTop: 40

  },
  button: {
    width: '30%',
    height: 40,
    paddingRight: 20

  },
  clearbutton: {
    width: '40%',
    height: 40,
    paddingLeft: 5,
   // backgroundColor: '#FF0000'
  },
  text: {
    paddingTop: 30,
    fontWeight: 'bold',
    fontSize: 17,
    color: 'blue'
  },
  textContainer: {
    flexDirection: 'row'
  },
  header: {
    paddingBottom: 120,
    
  
  }
});
