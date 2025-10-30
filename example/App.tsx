import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Use compiled output to avoid Metro resolving workspace deps
import { SwipeToDismiss } from 'swipe-to-dismiss';

export default function App() {
  const [items, setItems] = useState(['Alpha', 'Beta', 'Gamma']);
  const remove = (val: string) => {
    console.log('Removing', val);
    setItems((prev) => prev.filter((v) => v !== val));
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      {items.map((it) => (
        <SwipeToDismiss key={it} onRemove={() => remove(it)} dismissContainerCustomStyles={{ marginVertical: 8,borderRadius: 12 }}>
          <View style={styles.card}>
            <Text style={styles.label}>{it}</Text>
          </View>
        </SwipeToDismiss>
      ))}
      {items.length === 0 && <Text style={styles.label}>All dismissed</Text>}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111' },
  card: {
    backgroundColor: 'green',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  label: { color: 'white', fontSize: 16 },
});
