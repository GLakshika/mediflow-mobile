import { StyleSheet, Text, View } from 'react-native';

export default function AppTabs() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mediflow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});
