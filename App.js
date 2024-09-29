import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import { getDatabase, ref, push, onValue, remove, child, get } from "firebase/database";
import { app } from "./firebaseConfig"
import { useState, useEffect } from 'react';


export default function App() {

  const database = getDatabase(app);

  const [product, setProduct] = useState({
    title: '',
    amount: ''
  });
  const [items, setItems] = useState([]);
  console.log(items);





  const handleSave = () => {
    if (product.amount && product.title) {
      push(ref(database, 'items/'), product);
    }
    else {
      Alert.alert('Error', 'Type product and amount first');
    }
  };

  const deleteItem = (id) => {

    remove(child(ref(database), 'items/' + id))

  }

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      //console.log(data);

      if (data) {
        setItems(Object.entries(data));
      } else {
        setItems([]); // Handle the case when there are no items
      }
    })
  }, []);

  return (
    <View style={styles.container}>
      <TextInput style={styles.input}
        placeholder='Product'
        onChangeText={text => setProduct({ ...product, title: text })}
        value={product.title} />
      <TextInput
        style={styles.input}
        placeholder='Amount'
        onChangeText={text => setProduct({ ...product, amount: text })}
        value={product.amount} />
      <Button onPress={handleSave} title="Save" />

      <FlatList
        style={styles.list}
        ListHeaderComponent={<Text style={styles.header}>Shopping list</Text>}
        renderItem={({ item }) =>

          <View style={styles.listView}>
            <Text style={styles.listitem}>{item[1].title}, {item[1].amount}</Text>
            <Text style={styles.deleting} onPress={() => deleteItem(item[0])}>Delete</Text>
          </View>}
        data={items} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    marginBottom: 5
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  list: {
    marginTop: 20,

  },
  listitem: {
    fontSize: 18
  },
  deleting: {
    marginLeft: 10,
    color: '#0000ff',
    fontSize: 18
  },
  listView: {
    flexDirection: "row",

  },
});
